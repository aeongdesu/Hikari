const Discord = require("discord.js-light")
const { MessageEmbed } = require("discord.js-light")
const client = new Discord.Client({
    messageCacheLifetime: 60,
    fetchAllMembers: false,
    messageCacheMaxSize: 10,
    cacheRoles: true,
    cacheChannels: true
})
const fs = require("fs")
const { TOKEN, PREFIX, YTCK, TOPKEN } = require("./config.json")
const filters = require("./filters.json")
const DisTube = require("distube")
const AutoPoster = require("topgg-autoposter") // delete if you dont use top.gg

client.login(TOKEN)
client.commands = new Discord.Collection()
client.prefix = PREFIX
client.aliases = new Discord.Collection()
const cooldowns = new Discord.Collection()
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

// Client events

client.on("ready", () => {
    console.log(`------------------------------------\n${client.user.username} ready!`)
    const server = client.guilds.cache.size
    const voiceserver = client.voice.connections.size
    const cstatuslist = [
        `${PREFIX}도움`,
        `${PREFIX}초대`,
        `${voiceserver}/${server} 서버`
    ]
    setInterval(() => {
        const index = Math.floor(Math.random() * cstatuslist.length)
        client.user.setActivity(cstatuslist[index] + " | 보이스채널", { type: "COMPETING" })
    }, 10000)

    // delete if you dont use top.gg
    const ap = AutoPoster(TOPKEN, client)
    console.log("Post stats to top.gg..")
    ap.on("posted", () => {
        console.log("Posted stats to top.gg!")
    })
})

// Debug | client.on("debug", (e) => console.info(e))
client.on("warn", (info) => console.log(info))
client.on("error", console.error)

// Import Commands
fs.readdir("./commands/util/", (_err, files) => {
    const jsFiles = files.filter(f => f.split(".").pop() === "js")
    if (jsFiles.length <= 0) return console.log("명령어를 찾을 수 없어요!")
    jsFiles.forEach((file) => {
        const cmd = require(`./commands/util/${file}`)
        console.log(`Loaded ${file}`)
        client.commands.set(cmd.name, cmd)
        if (cmd.aliases) cmd.aliases.forEach(alias => client.aliases.set(alias, cmd.name))
    })
})

// Import Music Commands
fs.readdir("./commands/music/", (_err, files) => {
    const jsFiles = files.filter(f => f.split(".").pop() === "js")
    if (jsFiles.length <= 0) return console.log("명령어를 찾을 수 없어요!")
    jsFiles.forEach((file) => {
        const cmd = require(`./commands/music/${file}`)
        console.log(`Music Loaded ${file}`)
        client.commands.set(cmd.name, cmd)
        if (cmd.aliases) cmd.aliases.forEach(alias => client.aliases.set(alias, cmd.name))
    })
})

// client on
client.on("message", async message => {
    if (!message.guild || message.author.bot || message.channel.type === "dm") return
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`)
    if (!prefixRegex.test(message.content)) return

    const [, matchedPrefix] = message.content.match(prefixRegex)

    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/)
    const commandName = args.shift().toLowerCase()

    const command =
    client.commands.get(commandName) ||
    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName))

    if (!command) return

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection())
    }

    const now = Date.now()
    const timestamps = cooldowns.get(command.name)
    const cooldownAmount = (command.cooldown || 1) * 1000

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000
            return message.reply(
                `\`${command.name}\` 명령어는 ${timeLeft.toFixed(1)}초 뒤에 다시 사용하실수 있어요! <:sorry:796313836474990683>`
            )
        }
    }

    timestamps.set(message.author.id, now)
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)

    try {
        command.run(client, message, args)
    } catch (error) {
        console.error(error)
        message.reply(`에러TV)${error}`).catch(console.error)
    }
})

// DisTube for music
client.distube = new DisTube(client, {
    highWaterMark: 1 << 25,
    searchSongs: true,
    leaveOnEmpty: true,
    customFilters: filters,
    YoutubeCookie: YTCK
})

const status = (queue) => `음량: \`${queue.volume}%\` | 필터: \`${queue.filter || "꺼짐"}\` | 반복: \`${queue.repeatMode ? queue.repeatMode === 2 ? "전체 반복" : "한 곡만" : "꺼짐"}\` | 자동재생: \`${queue.autoplay ? "On" : "꺼짐"}\``

client.distube
    .on("playSong", (message, queue, song) => {
        queue.connection.voice.setSelfDeaf(true) // SelfDeaf
        // embed
        const Embed = new MessageEmbed()
            .setTitle(":white_check_mark: 재생중")
            .setColor("RANDOM")
            .addField("노래", `[\`${song.name}\` - \`${song.formattedDuration}\`](${song.url})`)
            .addField("신청자", `${song.user}`)
            .addField("상태", `${status(queue)}`)
            .setTimestamp()
        if (!song.thumbnail === null) {
            Embed.setThumbnail(`${song.thumbnail}`)
        }
        // end embed
        message.channel.send(Embed)
    })

    .on("addSong", (message, queue, song) => {
        // embed
        const Embed = new MessageEmbed()
            .setTitle(":white_check_mark: 추가 완료")
            .setColor("RANDOM")
            .addField("노래", `[\`${song.name}\` - \`${song.formattedDuration}\`](${song.url})`)
            .addField("신청자", `${song.user}`, true)
            .setTimestamp()
        if (!song.thumbnail === null) {
            Embed.setThumbnail(`${song.thumbnail}`)
        }
        // end embed
        message.channel.send(Embed)
    })

    .on("playList", (message, queue, playlist, song) => {
        // embed
        const Embed = new MessageEmbed()
            .setTitle(":white_check_mark: 추가 완료")
            .setColor("RANDOM")
            .addField("플레이리스트", `\`${playlist.name}\``)
            .addField("노래", `\`${song.name}\` - \`${song.formattedDuration}\``)
            .addField("신청자", `${song.user}`)
            .addField("상태", `${status(queue)}`)
            .setTimestamp()
        // end embed
        message.channel.send(Embed)
    })
    .on("addList", (message, queue, playlist) => {
        // embed
        const Embed = new MessageEmbed()
            .setTitle(":white_check_mark: 추가 완료")
            .setColor("RANDOM")
            .addField("플레이리스트", `\`${playlist.name}\``)
            .addField("노래", `${playlist.songs.length}개의 노래를 넣었어요.`)
            .addField("상태", `${status(queue)}`)
            .setTimestamp()
        // end embed
        message.channel.send(Embed)
    })
    .on("initQueue", queue => {
        queue.autoplay = false
    })
    // DisTubeOptions.searchSongs = true
    .on("searchResult", (message, result) => {
        let i = 0
        const resultname = result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")
        // embed
        const Embed = new MessageEmbed()
            .setTitle("검색")
            .setColor("RANDOM")
            .setDescription(`**아무거나 치시거나 60초뒤면 취소 됩니다.**\n 숫자를 입력해주세요!\n\n${resultname}`)
            .setTimestamp()
        // end embed
        message.channel.send(Embed)
    })
    // DisTubeOptions.searchSongs = true
    .on("empty", message => {})
    .on("finish", message => {
        // embed
        const Embed = new MessageEmbed()
            .setTitle("노래가 끝났어요!")
            .setColor("RANDOM")
            .setDescription("더이상 듣기를 원치 않는다면 `ㅑ나가` 명령어를 입력해주세요.")
        // end embed
        message.channel.send(Embed)
    })
    .on("searchCancel", (message) => message.channel.send(":thinking: 취소됐어요!"))
    .on("error", (message, err) => message.channel.send(`에러TV)${err}`))
    .on("noRelated", message => message.channel.send("404 video not found"))

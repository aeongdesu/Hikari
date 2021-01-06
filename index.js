const Discord = require("discord.js-light");
const { MessageEmbed } = require("discord.js-light");
const client = new Discord.Client({ cacheRoles: true, cacheChannels: true, cacheVoiceStates: true })
const fs = require("fs")
const { TOKEN, PREFIX, YTCK } = require("./config.json");
const filters = require("./filters.json");
const DisTube = require("distube");

client.login(TOKEN);
client.commands = new Discord.Collection();
client.prefix = PREFIX;
client.aliases = new Discord.Collection();
const cooldowns = new Discord.Collection();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Client events

client.on("ready", () => {
  console.log(`------------------------------------\n${client.user.username} ready!`);
  client.user.setActivity(`${PREFIX}도움 | ${client.guilds.cache.size} | 보이스채널`, { type: "COMPETING" });
});
client.on("warn", (info) => console.log(info));
client.on("error", console.error);

// Import Commands
fs.readdir("./commands/util/", (err, files) => {
  let jsFiles = files.filter(f => f.split(".").pop() === "js")
  if (jsFiles.length <= 0) return console.log("명령어를 찾을 수 없어요!")
  jsFiles.forEach((file) => {
      let cmd = require(`./commands/util/${file}`)
      console.log(`Loaded ${file}`)
      client.commands.set(cmd.name, cmd)
      if (cmd.aliases) cmd.aliases.forEach(alias => client.aliases.set(alias, cmd.name))
  })
})

// Import Music Commands
fs.readdir("./commands/music/", (err, files) => {
    let jsFiles = files.filter(f => f.split(".").pop() === "js")
    if (jsFiles.length <= 0) return console.log("명령어를 찾을 수 없어요!")
    jsFiles.forEach((file) => {
        let cmd = require(`./commands/music/${file}`)
        console.log(`Music Loaded ${file}`)
        client.commands.set(cmd.name, cmd)
        if (cmd.aliases) cmd.aliases.forEach(alias => client.aliases.set(alias, cmd.name))
    })
  })

// client on!
client.on('message', async message => {
  if (!message.guild || message.author.bot || message.channel.type == "dm") return;
  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`);
  if (!prefixRegex.test(message.content)) return;

  const [, matchedPrefix] = message.content.match(prefixRegex);

  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 1) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `\`${command.name}\` 명령어는 ${timeLeft.toFixed(1)}초 뒤에 다시 사용하실수 있어요! <:sorry:796313836474990683>`
      );
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.run(client, message, args);
  } catch (error) {
    console.error(error);
    message.reply(`에러TV)${error}`).catch(console.error);
  }
});

// DisTube for music
client.distube = new DisTube(client, { 
  highWaterMark: 1 << 25,
  searchSongs: true,
  leaveOnEmpty: true,
  customFilters: filters,
  YoutubeCookie: YTCK
});

const status = (queue) => `음량: \`${queue.volume}%\` | 필터: \`${queue.filter || "꺼짐"}\` | 반복: \`${queue.repeatMode ? queue.repeatMode == 2 ? "전체 반복" : "한 곡만" : "꺼짐"}\` | 자동재생: \`${queue.autoplay ? "On" : "꺼짐"}\``;

client.distube
    .on("playSong", (message, queue, song) => {
        // embed
    const Embed = new MessageEmbed()
    .setTitle(":white_check_mark: 재생중")
    .setColor("RANDOM")
    .setThumbnail(`${song.thumbnail}`)
    .addField("노래", `[\`${song.name}\` - \`${song.formattedDuration}\`](${song.url})`)
    .addField("신청자", `${song.user}`)
    .addField("상태", `${status(queue)}`)
    .setTimestamp();
        // end embed
    message.channel.send(Embed)
    })

    .on("addSong", (message, queue, song) => {
        // embed
    const Embed = new MessageEmbed()
    .setTitle(":white_check_mark: 추가 완료")
    .setColor("RANDOM")
    .setThumbnail(`${song.thumbnail}`)
    .addField("노래", `[\`${song.name}\` - \`${song.formattedDuration}\`](${song.url})`)
    .addField("신청자", `${song.user}`)
    .setTimestamp();
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
    .setTimestamp();
        // end embed
    message.channel.send(Embed)
    })
    .on("addList", (message, queue, playlist) => {
        // embed
    const Embed = new MessageEmbed()
    .setTitle(":white_check_mark: 추가 완료")
    .setColor("RANDOM")
    .addField("플레이리스트", `\`${playlist.name}\``)
    .addField("노래", `${playlist.songs.length}개의 노래를 넣었어요!`)
    .addField("상태", `${status(queue)}`)
    .setTimestamp();
        // end embed
    message.channel.send(Embed)
    })
    .on("initQueue", queue => {
        queue.autoplay = false;
    })
    // DisTubeOptions.searchSongs = true
    .on("searchResult", (message, result) => {
        let i = 0;
        let resultname = result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n");
        // embed
    const Embed = new MessageEmbed()
    .setTitle("검색")
    .setColor("RANDOM")
    .setDescription(`**아무거나 치시거나 60초뒤면 취소 됩니다.**\n 숫자를 입력해주세요!\n\n${resultname}`)
    .setTimestamp();
        // end embed
    message.channel.send(Embed).then(msg => {msg.delete({ timeout: 60000 }) })
    })
    // DisTubeOptions.searchSongs = true
    .on("empty", message => {})
    .on("finish", message => {
        // embed
    const Embed = new MessageEmbed()
    .setTitle("노래가 끝났다?!")
    .setColor("RANDOM")
    .setDescription("더이상 듣기 싫으신다면 `ㅑ나가` 명령어를 입력해주세요!");
        // end embed
    message.channel.send(Embed).then(msg => {msg.delete({ timeout: 60000 }) })
    })
    .on("searchCancel", (message) => message.channel.send(":thinking: 취소됐어요!").then(msg => {msg.delete({ timeout: 60000 }) }) )
    .on("error", (message, err) => message.channel.send(`에러TV)${err}`))
    .on("noRelated", message => message.channel.send("404 video not found").then(msg => {msg.delete({ timeout: 60000 }) }) );


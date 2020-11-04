const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const client = new Discord.Client()
const fs = require("fs")
const { TOKEN, PREFIX } = require("./config.json");
const DisTube = require("distube");

client.login(TOKEN);
client.commands = new Discord.Collection();
client.prefix = PREFIX;
client.aliases = new Discord.Collection();

// Client events

client.on("ready", () => {
  console.log(`------------------------------------\n${client.user.username} ready!`);
  client.user.setActivity(`${PREFIX}도움 | 400+ 이상 사이트 지원! | ${client.guilds.cache.size} | Beta`);
});
client.on("warn", (info) => console.log(info));
client.on("error", console.error);

// Import Commands
fs.readdir("./commands/util/", (err, files) => {
  let jsFiles = files.filter(f => f.split(".").pop() === "js")
  if (jsFiles.length <= 0) return console.log("Could not find any commands!")
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
    if (jsFiles.length <= 0) return console.log("Could not find any commands!")
    jsFiles.forEach((file) => {
        let cmd = require(`./commands/music/${file}`)
        console.log(`Music Loaded ${file}`)
        client.commands.set(cmd.name, cmd)
        if (cmd.aliases) cmd.aliases.forEach(alias => client.aliases.set(alias, cmd.name))
    })
  })

// client on!
client.on('message', async message => {
  if (!message.content.startsWith(PREFIX) || !message.guild || message.author.bot || message.channel.type == "dm") return
  const args = message.content.slice(PREFIX.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase();
  let cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))
  if (!cmd) return
  try {
      cmd.run(client, message, args)
  }
  catch (e) {
      console.error(e)
      message.reply(`에러TV)${e}`)
  }
});

// DisTube for music
client.distube = new DisTube(client, { 
  searchSongs: true
});

const status = (queue) => `음량: \`${queue.volume}%\` | 필터: \`${queue.filter || "꺼짐"}\` | 반복: \`${queue.repeatMode ? queue.repeatMode == 2 ? "전체 반복" : "한 곡만" : "꺼짐"}\` | 자동재생: \`${queue.autoplay ? "On" : "꺼짐"}\``;

client.distube
    .on("playSong", (message, queue, song) => {
        // embed
    const Embed = new MessageEmbed()
    .setTitle(":white_check_mark: 재생중")
    .setColor("RANDOM")
    .addField("노래", `\`${song.name}\` - \`${song.formattedDuration}\``)
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
    .addField("노래", `\`${song.name}\` - \`${song.formattedDuration}\``)
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
    message.channel.send(Embed)
    })
    // DisTubeOptions.searchSongs = true
    .on("searchCancel", (message) => message.channel.send(":thinking: 취소됐어요!"))
    .on("error", (message, err) => message.channel.send(`에러TV)${err}`))
    .on("noRelated", message => message.channel.send("삐빅 삐빅.. 더이상... 찾을 수 없습니다..."));


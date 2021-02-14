const { MessageEmbed } = require("discord.js-light");
const createBar = require('string-progressbar');
const { toColonNotation } = require('colon-notation');
module.exports = {
  name: "정보",
  aliases: ["노래정보"],
  description: "틀고있는 노래 정보를 보여줘요",
  cooldown: "5",
run: async (client, message) => {
    if (!message.member.voice.channel) return message.channel.send("보이스채널에 먼저 들어가셔야 해요!")
    if (!client.distube.isPlaying(message)) return message.channel.send("듣고 계신거 맞죠?!")
    const queue = client.distube.getQueue(message);
    const name = queue.songs.map(song => song.name);
    const user = queue.songs.map(song => song.user);
    // const avatar = message.author.displayAvatarURL({ dynamic: true, format: "png" });
    const link = queue.songs.map(song => song.url);
    const time = queue.songs.map(song => song.duration) * 1000;
    const currenttime = queue.currentTime;
    const tn = queue.songs.map(song => song.thumbnail);
    const remaining = (time - currenttime) < 0 ? `◉ LIVE` : time - currenttime;

    var total = time;
    var current = currenttime;
    const embed = new MessageEmbed()
    .setColor("RANDOM")
    .setThumbnail(`${tn}`)
    .setTitle(name)
    .setURL(`${link}`)
    .addField(`${createBar(time === 0 ? currenttime : time, currenttime, 10)[0]} \`[${queue.formattedCurrentTime}/${queue.songs.map(song => song.formattedDuration)}]\``, `\u200b`, false)
    .addField("신청자", user, false)
    .setFooter(`남은 시간 : \`${toColonNotation(remaining)}\``);
    try {
        message.channel.send(embed)
    } catch (e) {
        message.channel.send(`에러TV)\`${e}\``)
    }
}
}
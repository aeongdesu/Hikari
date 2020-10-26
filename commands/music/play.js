const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "재생",
  aliases: ["틀어", "노래"],
  description: "노래를 틀어줘요",
  cooldown: "5",
run: async (client, message, args) => {
    if (!message.member.voice.channel) return message.channel.send("보이스채널에 먼저 들어가셔야 해요!")
    let string = args.join(" ")
    let playEmbed = new MessageEmbed()
    .setTitle("Hikari :heart:")
    .setColor("RANDOM")
    .addField("ㅑ재생 <URL>", "[수많은 사이트들을 지원해요!](https://github.com/youtube-dl2/youtube-dl/blob/master/docs/supportedsites.md)\n~~스포티파이 빼고~~")
    .setTimestamp();
    if (!string) return message.channel.send(playEmbed)
    try {
        client.distube.play(message, string)
    } catch (e) {
        message.channel.send(`에러TV)\`${e}\``)
    }
}
}
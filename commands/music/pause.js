const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "일시정지",
  aliases: ["잠깐", "잠만"],
  description: "잠시 멈춰요!",
  cooldown: "5",
run: async (client, message) => {
    if (!message.member.voice.channel) return message.channel.send("보이스채널에 먼저 들어가셔야 해요!")
    if (!client.distube.isPlaying(message)) return message.channel.send("듣고 계신거 맞죠?!")
    try {
        message.react('👌');
        client.distube.pause(message)
    } catch (e) {
        message.channel.send(`에러TV)\`${e}\``)
    }
}
}
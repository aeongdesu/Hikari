const { MessageEmbed } = require("discord.js-light");
module.exports = {
  name: "정보",
  aliases: ["노래정보"],
  description: "틀고있는 노래 정보를 보여줘요",
  cooldown: "5",
run: async (client, message) => {
    if (!message.member.voice.channel) return message.channel.send("보이스채널에 먼저 들어가셔야 해요!")
    if (!client.distube.isPlaying(message)) return message.channel.send("듣고 계신거 맞죠?!")
    const queue = client.distube.getQueue(message);
    const name = queue.songs.map(song => song.name)
    const link = queue.songs.map(song => song.url)
    const user = queue.songs.map(song => song.user)
    const duration = queue.songs.map(song => song.formattedDuration)
    const tn = queue.songs.map(song => song.thumbnail)

    const embed = new MessageEmbed()
    .setTitle("재생중")
    .setColor("RANDOM")
    .setThumbnail(`${tn}`)
    .setDescription(`[${name}](${link})`)
    .addField("길이", `${duration}`, true)
    .setTimestamp();
    try {
        message.channel.send(embed)
    } catch (e) {
        message.channel.send(`에러TV)\`${e}\``)
    }
}
}

const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "필터",
  description: "노래에다 필터를 쏘옥!",
  aliases: '',
  cooldown: "5",
run: async (client, message, args) => {
    if (!message.member.voice.channel) return message.channel.send("보이스채널에 먼저 들어가셔야 해요!")
    if (!client.distube.isPlaying(message)) return message.channel.send("듣고 계신거 맞죠?!")
    let string = args.join(" ")
    let NoEmbed = new MessageEmbed()
    .setTitle("Hikari :heart:")
    .setColor("RANDOM")
    .setDescription("**필터 설정시 노래를 다시 시작합니다!**")
    .addField("필터들", "`3d`, `bassboost`, `echo`, `karaoke`, `nightcore`, `vaporwave`")
    .setTimestamp();

    if (!string) return message.channel.send(NoEmbed)
    try {
        let filter = client.distube.setFilter(message, string);
        let Embed = new MessageEmbed()
        .setTitle(":white_check_mark:")
        .setColor("RANDOM")
        .addField("필터가 설정됐어요!", (filter || "꺼짐"))
        .setTimestamp();
        message.channel.send(Embed)
    } catch (e) {
        message.channel.send(`에러TV)\`${e}\``)
    }
}
}
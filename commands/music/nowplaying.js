/*
const musicUtil = require("../../utils/music")
module.exports = {
    name: "정보",
    aliases: ["노래정보"],   
    description: "틀고있는 노래 정보를 보여줍니다",
    run: async (client, message) => {
        const queue = client.distube.getQueue(message)
        if (!message.member.voice.channel) return message.reply("보이스채널에 먼저 들어가셔야 해요.")
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.reply("저런, 저랑 같은 보이스채널에 계셔야 해요.")
        if (!queue) return message.channel.send("대기열에 노래가 없어요.")
        if (!queue.playing && !queue.paused) return message.channel.send("듣고 계신거 맞죠?!")

        const nowPlayingTarget = await message.reply({ embeds: [musicUtil.nowPlayingEmbed(queue)]})
        musicUtil.liveNowPlayingMessage(client, nowPlayingTarget, queue)
    }
}
*/
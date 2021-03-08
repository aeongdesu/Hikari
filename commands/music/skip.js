module.exports = {
    name: "스킵",
    aliases: ["넘겨", "건너", "건너뛰기"],
    description: "노래를 넘겨요",
    cooldown: "5",

    run: async (client, message) => {
        try {
            if (!message.member.voice.channel) return message.channel.send("보이스채널에 먼저 들어가셔야 해요.")
            if (!client.distube.isPlaying(message)) return message.channel.send("듣고 계신거 맞죠?!")
            client.distube.skip(message)
        } catch (e) {
            message.channel.send(`에러가 발생했습니다.\n\`${e}\``)
        }
    }
}

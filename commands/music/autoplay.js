module.exports = {
    name: "자동재생",
    aliases: ["알고리즘"],
    description: "자동재생을 해줘요",
    cooldown: "5",
    run: async (client, message) => {
        try {
            if (!message.member.voice.channel) return message.channel.send("보이스채널에 먼저 들어가셔야 해요.")
            if (!client.distube.isPlaying(message)) return message.channel.send("듣고 계신거 맞죠?!")
            const mode = client.distube.toggleAutoplay(message)
            message.channel.send(`자동재생이 ${(mode ? "켜졌어요!" : "꺼졌어요!")}`)
        } catch (e) {
            message.channel.send(`에러가 발생했습니다.\n\`${e}\``)
        }
    }
}

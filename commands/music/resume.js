module.exports = {
    name: "다시시작",
    aliases: ["다시", "다시재생"],
    description: "잠시 멈춰둔걸 다시 틀어줘요",
    cooldown: "5",
    run: async (client, message) => {
        if (!message.member.voice.channel) return message.channel.send("보이스채널에 먼저 들어가셔야 해요.")
        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send("대기열에 노래가 없어요.")
        try {
            message.channel.send("노래를 다시 재생시켰어요. :musical_note:")
            client.distube.resume(message)
        } catch (e) {
            message.channel.send(`에러가 발생했습니다.\n\`${e}\``)
        }
    }
}

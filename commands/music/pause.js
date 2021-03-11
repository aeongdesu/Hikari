module.exports = {
    name: "일시정지",
    aliases: ["잠깐", "잠만"],
    description: "잠시 멈춰둬요",
    cooldown: "5",
    run: async (client, message) => {
        if (!message.member.voice.channel) return message.channel.send("보이스채널에 먼저 들어가셔야 해요.")
        if (!client.distube.isPlaying(message)) {
            client.distube.resume(message)
            return message.channel.send("노래를 다시 재생시켰어요. :musical_note:")
        }
        try {
            message.channel.send(`노래를 일시정지 시켰어요, *다시 재생하려면 한번더 입력해주시거나 \`${client.prefix}다시\`를 입력해주세요.*`)
            client.distube.pause(message)
        } catch (e) {
            message.channel.send(`에러가 발생했습니다.\n\`${e}\``)
        }
    }
}

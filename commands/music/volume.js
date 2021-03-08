module.exports = {
    name: "음량",
    aliases: ["볼륨"],
    description: "음량을 조절해요",
    cooldown: "5",
    run: async (client, message, args) => {
        if (!message.member.voice.channel) return message.channel.send("보이스채널에 먼저 들어가셔야 해요.")
        if (!client.distube.isPlaying(message)) return message.channel.send("듣고 계신거 맞죠?!")
        const volume = parseInt(args[0])
        if (isNaN(volume) || volume > 100) return message.channel.send("`0 ~ 100`까지에요, 기본은 `50%`")
        try {
            client.distube.setVolume(message, volume)
            message.channel.send(`\`${volume}%\`로 설정했어요!`)
        } catch (e) {
            message.channel.send(`에러가 발생했습니다.\n\`${e}\``)
        }
    }
}

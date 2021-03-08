module.exports = {
    name: "정지",
    aliases: ["멈춰"],
    description: "노래를 정지시켜요",
    cooldown: "5",
    run: async (client, message, args) => {
        try {
            if (!message.member.voice.channel) return message.channel.send("보이스채널에 먼저 들어가셔야 해요.")
            if (!client.distube.isPlaying(message)) return message.channel.send("듣고 계신거 맞죠?!")
            const filter = m => m.author.id === message.author.id
            return message.channel.send("노래를 정지시킬까요? **(네 / 아니요)**").then(() => {
                message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 30000,
                    errors: ["time"]
                })
                    .then(message => {
                        message = message.first()
                        if (message.content.toUpperCase() === "네") {
                            client.distube.stop(message)
                        } else if (message.content.toUpperCase() === "아니요") {
                            message.channel.send("계속 노래를 틀을게요.")
                        } else {
                            message.channel.send("알맞지 않은 대답이에요.")
                        }
                    })
                    .catch(collected => {
                        message.channel.send("30초가 지났어요.")
                    })
            })
        } catch (e) {
            message.channel.send(`에러가 발생했습니다.\n\`${e}\``)
        }
    }
}

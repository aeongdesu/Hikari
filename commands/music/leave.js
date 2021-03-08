module.exports = {
    name: "나가",
    aliases: ["떠나기", "나가기"],
    description: "히카리를 보이스채널에서 나가게 해요",
    cooldown: "5",

    run: async (client, message) => {
        try {
            if (!message.member.voice.channel) return message.channel.send("보이스채널에 먼저 들어가셔야 해요.")
            if (client.distube.isPlaying(message)) {
                const filter = m => m.author.id === message.author.id
                return message.channel.send("재생중인 노래(또는 대기열)이 있습니다, 노래를 정지시킬까요? **(네 / 아니요)**").then(() => {
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
            }
            message.guild.voice.channel.leave()
        } catch (e) {
            message.channel.send(`에러가 발생했습니다.\n\`${e}\``)
        }
    }
}

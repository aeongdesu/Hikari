const { toMilliseconds } = require("colon-notation")
module.exports = {
    name: "점프",
    aliases: [],
    description: "원하는 구간으로 점프할 수 있어요",
    cooldown: "5",

    run: async (client, message, args) => {
        if (!message.member.voice.channel) return message.channel.send("보이스채널에 먼저 들어가셔야 해요.")
        if (!client.distube.isPlaying(message)) return message.channel.send("듣고 계신거 맞죠?!")
        const queue = client.distube.getQueue(message)
        const duration = queue.songs.map(song => song.duration) * 1000
        const fduration = queue.songs.map(song => song.formattedDuration)
        const islive = queue.songs.map(song => song.isLive)
        const atm = toMilliseconds(args[0])
        if (islive === true) return message.channel.send("생방송은 지원하지 않아요.")
        if (atm > duration) return message.channel.send(`올바른 숫자를 입력해주세요! 현재 영상 길이는 \`${fduration}\` 에요.`)
        message.channel.send(`'${args[0]}' 구간으로 점프합니다, *너무 길게 점프하면 노래가 다시시작 할수도 있어요.*`)
        client.distube.seek(message, Number(atm))
    }
}

const { toMilliseconds } = require('colon-notation');
module.exports = {
    name: "점프",
    aliases: [],
    description: "이부분 지겹다",
    cooldown: "5",

    run: async (client, message, args) => {
        if (!message.member.voice.channel) return message.channel.send("보이스채널에 먼저 들어가셔야 해요!")
        if (!client.distube.isPlaying(message)) return message.channel.send("듣고 계신거 맞죠?!")
        const queue = client.distube.getQueue(message)
        const duration = queue.songs.map(song => song.duration)*1000
        const fduration = queue.songs.map(song => song.formattedDuration)
        const islive = queue.songs.map(song => song.isLive)
        const atm = toMilliseconds(args[0])
        if (islive === true) return message.channel.send("생방송은 지원하지 않아요.")
        if (atm > duration) return message.channel.send(`올바른 숫자를 입력해주세요! 현재 영상 길이는 \`${fduration}\` 에요.`)
        client.distube.seek(message, Number(atm))
        message.react('775962682343686144');
    }
}
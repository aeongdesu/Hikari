module.exports = {
    name: "나가",
    aliases: ["떠나기", "나가기"],
    description: "히카리는 왜 안나갈까?",
    cooldown: "5",

    run: async (client, message) => {
        if (!message.member.voice.channel) return message.channel.send("보이스채널에 먼저 들어가셔야 해요!")
        if (client.distube.isPlaying(message)) return message.channel.send("더이상 듣기 싫을때 쓰는 명령어에요, `ㅑ정지` 를 사용해주세요!")
        message.guild.voice.channel.leave()
    }
}

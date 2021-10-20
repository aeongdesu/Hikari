module.exports = {
    name: "정지",
    aliases: ["멈춰"],
    description: "노래를 정지합니다",
    cooldown: "5",
    run: async (client, message) => {
        if (!message.member.voice.channel) return message.reply("보이스채널에 먼저 들어가셔야 해요.")
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.reply("저런, 저랑 같은 보이스채널에 계셔야 해요.")
        const queue = client.distube.getQueue(message)
        if (!queue) return message.reply(`재생중인 노래가 없어요, \`${client.config.prefix}재생 <URL/제목>\` 명령어로 재생해 주세요.`)
        client.distube.stop(message)
    }
}
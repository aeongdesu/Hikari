const { MessageEmbed } = require("discord.js-light")
const createBar = require("string-progressbar")
const { toColonNotation } = require("colon-notation")
module.exports = {
    name: "정보",
    aliases: ["노래정보"],
    description: "틀고있는 노래 정보를 보여줘요",
    cooldown: "5",
    run: async (client, message) => {
        if (!message.member.voice.channel) return message.channel.send("보이스채널에 먼저 들어가셔야 해요.")
        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send("대기열에 노래가 없어요.")
        if (!queue && !client.distube.isPlaying(message)) return message.channel.send("듣고 계신거 맞죠?!")
        const song = queue.songs[0]
        const name = song.name
        const user = song.user.tag
        const avatar = song.user.displayAvatarURL({ dynamic: true, format: "png" })
        const link = song.url
        const time = song.duration * 1000
        const currenttime = queue.currentTime
        const tn = song.thumbnail
        const remaining = (time - currenttime) < 0 ? "◉ LIVE" : time - currenttime
        try {
            const embed = new MessageEmbed()
                .setColor("RANDOM")
                .setAuthor(user, avatar)
                .setTitle(name)
                .setURL(`${link}`)
                .setDescription(`${createBar(time === 0 ? currenttime : time, currenttime, 10)[0]} \`[${queue.formattedCurrentTime}/${song.formattedDuration}]\`\n` +
                `${client.distube.isPaused(message) === true ? ":pause_button:" : ":arrow_forward:"} ${time === 0 ? "" : `| 남은 시간: \`${toColonNotation(remaining)}\``}`)
            if (!song.thumbnail === null) {
                embed.setThumbnail(`${tn}`)
            }
            message.channel.send(embed)
        } catch (e) {
            message.channel.send(`에러가 발생했습니다.\n\`${e}\``)
        }
    }
}

const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const createBar = require("string-progressbar")
const toColonNotation = require("pretty-ms")

module.exports = {
    nowPlayingEmbed: async (queue) => {
        const song = await queue.songs[0]
        const time = song.duration
        const currenttime = queue.currentTime
        const remaining = (time - currenttime) * 1000
        const user = song.user.tag === client.user.tag ? "추천 영상" : song.user.tag
        const avatar = song.user.displayAvatarURL({ dynamic: true, format: "png" })
        new MessageEmbed()
            .setColor("cbd0ed")
            .setAuthor(user, avatar)
            .setTitle(song.name)
            .setURL(song.url)
            .setDescription(
                `${createBar.splitBar(time === 0 ? currenttime : time, currenttime, 10)[0]} \`[${queue.formattedCurrentTime}/${song.formattedDuration}]\`\n` +
            `${time === 0 ? "" : `남은 시간: \`${toColonNotation(remaining, { secondsDecimalDigits: 0, colonNotation: true })}\``}`
            )
    },
    liveNowPlayingMessage: async (client, message, queue) => {
        this.NPmessage = message
        this.interval = setInterval(async () => {
            if (message.deleted) return clearInterval(this.interval)
            if (!queue.songs.length) {
                clearInterval(this.interval)
                return message.edit({ embeds: [new MessageEmbed().setColor("cbd0ed").setTitle("재생할 곡이 없어요!")], components: [] })
            }
            const playorpauseEmoji = queue.paused ? "▶️" : "⏸️"

            const button = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId("previous")
                        .setEmoji("⏮")
                        .setStyle("SECONDARY"),
                    new MessageButton()
                        .setCustomId("playorpause")
                        .setEmoji(playorpauseEmoji)
                        .setStyle("PRIMARY"),
                    new MessageButton()
                        .setCustomId("stop")
                        .setEmoji("⏹️")
                        .setStyle("DANGER"),
                    new MessageButton()
                        .setCustomId("forward")
                        .setEmoji("⏭")
                        .setStyle("SECONDARY")
                )
            if (song.isLive) {
                clearInterval(this.interval)
                const embed = new MessageEmbed()
                    .setColor("cbd0ed")
                    .setAuthor(user, avatar)
                    .setTitle(song.name)
                    .setURL(song.url)
                    .setDescription("◉ 생방송")
                if (song.thumbnail) embed.setThumbnail(song.thumbnail)
                try {
                    return message.edit({ content: null, embeds: [this.embed(song)], components: [button] })
                } catch (e) {
                    return clearInterval(this.interval)
                }
            }
            try {
                return message.edit({ content: null, embeds: [this.embed(song)], components: [button] })
            } catch (e) {
                return clearInterval(this.interval)
            }
        }, 5000)
    }
}
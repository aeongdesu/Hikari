const { Formatters, Util, MessageEmbed } = require("discord.js")
const { DisTube } = require("distube")
const { SoundCloudPlugin } = require("@distube/soundcloud")
const { SpotifyPlugin } = require("@distube/spotify")

module.exports = (client) => {
    client.distube = new DisTube(client, {
        emitNewSongOnly: true,
        searchSongs: 10,
        leaveOnEmpty: true,
        customFilters: client.config.filters,
        plugins: [
            new SpotifyPlugin(),
            new SoundCloudPlugin({
                api: {
                    clientId: client.config.spotify.clientID,
                    clientSecret: client.config.spotify.clientSecret,
                }
            })
        ],
        ytdlOptions: { highWaterMark: 1<<25 }
    })

    const status = (queue) => `음량: \`${queue.volume}%\` | 필터: \`${queue.filter || "꺼짐"}\` | 반복: \`${queue.repeatMode ? queue.repeatMode === 2 ? "전체 반복" : "한 곡만" : "꺼짐"}\` | 자동재생: \`${queue.autoplay ? "켜짐" : "꺼짐"}\``

    client.distube
        .on("initQueue", queue => {
            queue.autoplay = false
            queue.voice.setSelfDeaf(true)
        })
        .on("playSong", (queue, song) => {
            const embed = new MessageEmbed()
                .setTitle(":white_check_mark: 재생중")
                .setColor("cbd0ed")
                .addField("노래", `[\`${Util.escapeMarkdown(song.name)}\` - \`${song.formattedDuration}\`](${song.url})`)
                .addField("신청자", `${song.user}`)
                .addField("상태", `${status(queue)}`)
                .setTimestamp()
            if (song.thumbnail) {
                embed.setThumbnail(`${song.thumbnail}`)
            }
            queue.textChannel.send({ embeds: [embed] })

            if (queue.voiceChannel.type === "stage" && queue.voiceChannel.manageable) {
                queue.clientMember.voice.setSuppressed(false)
            }
            if (queue.voiceChannel.type === "stage" && !queue.voiceChannel.manageable && queue.clientMember.voice.suppress) {
                const embed = new MessageEmbed()
                    .setTitle(":grey_exclamation: 잠시만요!")
                    .setColor("cbd0ed")
                    .setDescription("저에게 스테이지 관리 권한을 부여해 주시거나 발언권 요청을 받아주세요.")
                    .setImage("https://nyan.shx.gg/a0QDsc.gif")
                    .setTimestamp()
                queue.textChannel.send({ embeds: [embed] })
                queue.clientMember.voice.setRequestToSpeak(true)
            }
        })
        .on("addSong", (queue, song) => {
            const embed = new MessageEmbed()
                .setTitle(":white_check_mark: 추가 완료")
                .setColor("cbd0ed")
                .addField("노래", `[\`${Util.escapeMarkdown(song.name)}\` - \`${song.formattedDuration}\`](${song.url})`)
                .addField("신청자", `${song.user}`, true)
                .setTimestamp()
            if (song.thumbnail) {
                embed.setThumbnail(`${song.thumbnail}`)
            }
            queue.textChannel.send({ embeds: [embed] })
        })
        .on("addList", (queue, playlist) => {
            const embed = new MessageEmbed()
                .setTitle(":white_check_mark: 추가 완료")
                .setColor("cbd0ed")
                .addField("플레이리스트", `\`${Util.escapeMarkdown(playlist.name)}\``)
                .addField("노래", `${playlist.songs.length}개의 노래를 넣었어요.`)
                .addField("상태", `${status(queue)}`)
                .setTimestamp()
            queue.textChannel.send({ embeds: [embed] })
        })
        .on("searchResult", (message, result) => {
            let i = 0
            message.channel.send("**아무거나 치시거나 60초뒤면 취소 됩니다.**\n"
            +   "알맞는 숫자를 입력해 주세요!")
            const resultname = result.map(song => `${++i}. ${song.name} - ${song.formattedDuration}`)
                .slice(0, 1990).join("\n")
            message.channel.send(`\n\n${Formatters.codeBlock("md", resultname)}`)
        })
        .on("searchCancel", message => message.channel.send("취소됐어요! :pensive:"))
        .on("searchInvalidAnswer", message => message.channel.send("취소됐어요! :pensive:"))
        .on("searchNoResult", message => message.channel.send("404 video not found"))
        .on("searchDone", () => {})
        .on("noRelated", queue => queue.textChannel.send("삐빅.. 추천 영상을 찾을 수 없습니다.."))
        .on("finish", queue => {
            const embed = new MessageEmbed()
                .setTitle("노래가 끝났어요!")
                .setColor("cbd0ed")
                .setDescription(`더이상 듣기를 원치 않는다면 \`${client.config.prefix}나가\` 명령어를 입력해 주세요.`)
            queue.textChannel.send({ embeds: [embed] })
        })
        .on("disconnect", queue => {
            queue.stop()
        })
        .on("error", (channel, e) => {
            channel.send("에러가 발생 하였습니다!\n")
            channel.send(Formatters.codeBlock("js", e))
            console.warn(e)
        })
}

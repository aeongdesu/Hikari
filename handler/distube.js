const { Util, MessageEmbed } = require("discord.js")
const DisTube = require("distube")
const SpotifyPlugin = require("@distube/spotify")
const config = require("../config.json")

module.exports = (client) => {
    client.distube = new DisTube(client, {
        searchSongs: 10,
        leaveOnEmpty: true,
        leaveOnFinish: true,
        leaveOnStop: true,
        customFilters: config.filters,
        YoutubeCookie: config.ytcookie,
        plugins: [new SpotifyPlugin()]
    })

    const status = (queue) => `음량: \`${queue.volume}%\` | 필터: \`${queue.filter || "꺼짐"}\` | 반복: \`${queue.repeatMode ? queue.repeatMode === 2 ? "전체 반복" : "한 곡만" : "꺼짐"}\` | 자동재생: \`${queue.autoplay ? "켜짐" : "꺼짐"}\``

    client.distube
        .on("playSong", (queue, song) => {
            queue.textChannel.stopTyping(true)
            const embed = new MessageEmbed()
                .setTitle(":white_check_mark: 재생중")
                .setColor("000000")
                .addField("노래", `[\`${Util.escapeMarkdown(song.name)}\` - \`${song.formattedDuration}\`](${song.url})`)
                .addField("신청자", `${song.user}`)
                .addField("상태", `${status(queue)}`)
                .setTimestamp()
            if (!song.thumbnail === null) {
                embed.setThumbnail(`${song.thumbnail}`)
            }
            queue.textChannel.send(embed)

            if (queue.connection.channel.type === "stage" && queue.connection.channel.manageable) {
                queue.connection.voice.setSuppressed(false)
            }
            if (queue.connection.channel.type === "stage" && !queue.connection.channel.manageable) {
                const embed = new MessageEmbed()
                    .setTitle(":grey_exclamation: 잠시만요!")
                    .setColor("FFFFFF")
                    .setDescription("스테이지 채널에서 재생하려는데 제가 스테이지 관리자가 아닌것 같아요.\n\n편리하게 이용하기 위해 하단 움짤처럼 절 스테이지 관리자로 추가해주세요.\n\n아, 참고로 혹시 몰라서 방금 손 번쩍 들었으니 확인해보세요! :)")
                    .setImage("https://nyan.shx.gg/Dn7V89.gif")
                    .setTimestamp()
                queue.textChannel.send(embed)
                queue.connection.voice.setRequestToSpeak(true)
            }
            queue.connection.voice.setSelfDeaf(true)
        })
        .on("addSong", (queue, song) => {
            queue.textChannel.stopTyping(true)
            const embed = new MessageEmbed()
                .setTitle(":white_check_mark: 추가 완료")
                .setColor("000000")
                .addField("노래", `[\`${Util.escapeMarkdown(song.name)}\` - \`${song.formattedDuration}\`](${song.url})`)
                .addField("신청자", `${song.user}`, true)
                .setTimestamp()
            if (!song.thumbnail === null) {
                embed.setThumbnail(`${song.thumbnail}`)
            }
            queue.textChannel.send(embed)
        })
        .on("addList", (queue, playlist) => {
            queue.textChannel.stopTyping(true)
            const embed = new MessageEmbed()
                .setTitle(":white_check_mark: 추가 완료")
                .setColor("000000")
                .addField("플레이리스트", `\`${Util.escapeMarkdown(playlist.name)}\``)
                .addField("노래", `${playlist.songs.length}개의 노래를 넣었어요.`)
                .addField("상태", `${status(queue)}`)
                .setTimestamp()
            queue.textChannel.send(embed)
        })
        .on("searchResult", (message, result) => {
            let i = 0
            const resultname = Util.splitMessage(result.map(song => `**${++i}**. ${Util.escapeMarkdown(song.name)} - \`${song.formattedDuration}\``).join("\n"), { maxLength: 1990 })
            const embed = new MessageEmbed()
                .setTitle("검색")
                .setColor("000000")
                .setDescription(`**아무거나 치시거나 60초뒤면 취소 됩니다.**\n 숫자를 입력해주세요!\n\n${resultname}`)
                .setTimestamp()
            message.channel.send(embed)
        })
        .on("searchCancel", message => {
            message.channel.stopTyping(true)
            message.channel.send("취소됐어요! :pensive:")
        })
        .on("error", (channel, e) => {
            channel.stopTyping(true)
            channel.send(`에러가 발생하였습니다!\n\`\`\`\n${e}\n\`\`\``)
            console.error(e)
        })
        .on("searchNoResult", message => message.channel.send("404 video not found"))
        .on("finish", queue => {
            const embed = new MessageEmbed()
                .setTitle("노래가 끝났어요!")
                .setColor("000000")
                .setDescription(`더이상 듣기를 원치 않는다면 \`${config.prefix}나가\` 명령어를 입력해주세요.`)
            queue.textChannel.send(embed)
        })
}

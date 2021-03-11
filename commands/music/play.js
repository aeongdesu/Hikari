const { MessageEmbed } = require("discord.js-light")
const { getData } = require("spotify-url-info")

module.exports = {
    name: "재생",
    aliases: ["틀어", "노래"],
    description: "노래를 틀어줘요",
    cooldown: "5",
    run: async (client, message, args) => {
        if (!message.member.voice.channel) return message.channel.send("보이스채널에 먼저 들어가셔야 해요.")
        const permissions = message.channel.permissionsFor(message.client.user)
        if (!permissions.has("CONNECT") && !permissions.has("SPEAK")) return message.reply("히카리는 `연결`, `말하기`, `반응 추가하기`, `외부 이모티콘 사용하기` 권한이 필요해요!")
        if (!permissions.has("CONNECT")) return message.reply("유감스럽게도 저에게 `연결` 권한이 없어요 :<")
        if (!permissions.has("SPEAK")) return message.reply("유감스럽게도 저에게 `말하기` 권한이 없어요 :<")

        const string = args.join(" ")
        const playEmbed = new MessageEmbed()
            .setTitle("Hikari :heart:")
            .setColor("RANDOM")
            .addField(`${client.prefix}재생 <URL>`, "[수많은 사이트들을 지원해요!](https://ytdl-org.github.io/youtube-dl/supportedsites.html)\n**Spotify도 가능해요, 단 팟캐스트, 앨범은 지원하지 않아요.**")
            .setTimestamp()
        if (!string) return message.channel.send(playEmbed)
        // spotify
        const spourl = /^(https?:\/\/)+?(www\.)?(open\.spotify\.com)\/(track)\/.+$/gi
        const spoalurl = /^(https?:\/\/)+?(www\.)?(open\.spotify\.com)\/(album)\/.+$/gi
        const spoplurl = /^(https?:\/\/)+?(www\.)?(open\.spotify\.com)\/(playlist)\/.+$/gi
        const sposhowurl = /^(https?:\/\/)+?(www\.)?(open\.spotify\.com)\/(show)\/.+$/gi
        const spoepiurl = /^(https?:\/\/)+?(www\.)?(open\.spotify\.com)\/(episode)\/.+$/gi
        if (spourl.test(string)) {
            try {
                const spodata = await getData(string)
                if (!spodata) return message.channel.send("올바르지 않은 Spotify 링크입니다.")
                const sposearch = spodata.name
                const spouri = spodata.uri
                message.channel.send(`https://scannables.scdn.co/uri/plain/png/000000/white/640/${spouri}`)
                message.channel.send("<a:loading:775963839862145024> 로딩중..")
                return client.distube.play(message, sposearch)
            } catch (e) {
                message.channel.send(`에러가 발생했습니다.\n\`${e}\``)
            }
        } else if (spoalurl.test(string)) {
            return message.channel.send("유감스럽게도 Spotify 앨범은 지원하지 않아요, 곧 지원할 예정이니 기대해주세요!")
        } else if (spoplurl.test(string)) {
            try {
                const playlist = await getData(string)
                if (!playlist) return message.channel.send("올바르지 않은 Spotify 링크입니다.")
                message.channel.send("<a:loading:775963839862145024> 로딩중.. *시간이 많이 걸릴수도 있습니다.*")
                const items = playlist.tracks.items
                const tracks = []
                let s
                for (let i = 0; i < items.length; i++) {
                    const results = await client.distube.search(`${items[i].track.artists[0].name} - ${items[i].track.name}`)
                    if (results.length < 1) {
                        // eslint-disable-next-line no-unused-vars
                        s++ // could be used later for skipped tracks due to result not being found
                        continue
                    }
                    tracks.push(results[0].url)
                }
                await client.distube.playCustomPlaylist(message, tracks, { name: playlist.name })
            } catch (e) {
                message.channel.send(`에러가 발생했습니다.\n\`${e}\``)
            }
        } else if (sposhowurl.test(string) || spoepiurl.test(string)) {
            return message.channel.send("유감스럽게도 Spotify 팟캐스트는 지원하지 않아요.")
        } else if (!spourl.test(string) || !spoalurl.test(string) || !spoplurl.test(string) || !sposhowurl.test(string) || !spoepiurl.test(string)) {
            try {
                message.channel.send("<a:loading:775963839862145024> 로딩중..")
                client.distube.play(message, string)
            } catch (e) {
                message.channel.send(`에러가 발생했습니다.\n\`${e}\``)
            }
        }
    }
}

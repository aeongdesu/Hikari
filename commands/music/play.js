const { MessageEmbed } = require("discord.js-light");
var { getData } = require("spotify-url-info");

module.exports = {
  name: "재생",
  aliases: ["틀어", "노래"],
  description: "노래를 틀어줘요",
  cooldown: "5",
run: async (client, message, args) => {
    if (!message.member.voice.channel) return message.channel.send("보이스채널에 먼저 들어가셔야 해요!")
    const permissions = message.channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") && !permissions.has("SPEAK") && !permissions.has("ADD_REACTIONS") && !permissions.has("USE_EXTERNAL_EMOJIS")) return message.reply("히카리는 `연결`, `말하기`, `반응 추가하기`, `외부 이모티콘 사용하기` 권한이 필요해요!")
    if (!permissions.has("CONNECT")) return message.reply("유감스럽게도 저에게 `연결` 권한이 없어요 :<")
    if (!permissions.has("SPEAK")) return message.reply("유감스럽게도 저에게 `말하기` 권한이 없어요 :<")
    if (!permissions.has("ADD_REACTIONS")) return message.reply("유감스럽게도 저에게 `반응 추가하기` 권한이 없어요 :<")
    if (!permissions.has("USE_EXTERNAL_EMOJIS")) return message.reply("유감스럽게도 저에게 `외부 이모티콘 사용하기` 권한이 없어요 :<")

    let string = args.join(" ")
    let playEmbed = new MessageEmbed()
    .setTitle("Hikari :heart:")
    .setColor("RANDOM")
    .addField("ㅑ재생 <URL>", "[수많은 사이트들을 지원해요!](https://ytdl-org.github.io/youtube-dl/supportedsites.html)\n**스포티파이도 가능해요, 단 플레이리스트, 트랙, 팟캐스트는 지원하지 않아요.")
    .setTimestamp();
    if (!string) return message.channel.send(playEmbed)
    // spotify
    // |link\.tospotify\.com not supported now
    let spourl = /^(https?:\/\/)+?(www\.)?(open\.spotify\.com)\/(track)\/.+$/gi
    let spoplurl = /^(https?:\/\/)+?(www\.)?(open\.spotify\.com)\/(playlist)\/.+$/gi
    let sponoturl = /^(https?:\/\/)+?(www\.)?(link\.tospotify\.com)\/.+$/gi
    if (spourl.test(string)) {
        try {
        const spodata = await getData(string);  
        const sposearch = spodata.name
        const spouri = spodata.uri
        message.channel.send(`https://scannables.scdn.co/uri/plain/png/000000/white/640/${spouri}`)
        message.channel.send("<a:loading:775963839862145024> 로딩중..")
        return client.distube.play(message, sposearch)
        } catch (e) {
        message.channel.send(`에러TV)\`${e}\``)
        }
    } else if (spoplurl.test(string)) {
        try {
        const playlist = await getData(string);
        if (!playlist) return message.channel.send("This is not a valid Spotify playlist link");
        let items = playlist.tracks.items
        let tracks = []
        let s;
        for (var i = 0; i < items.length; i++) {
            let results = await client.distube.search(`${items[i].track.artists[0].name} - ${items[i].track.name}`);
            if (results.length < 1) {
               s++ // could be used later for skipped tracks due to result not being found
               continue;
            }
            tracks.push(results[0].url);
        }
        await client.distube.playCustomPlaylist(message, tracks, { name: playlist.name });
        } catch (e) {
        return message.channel.send("유감스럽게도 스포티파이 플레이리스트는 지원하지 않아요.")
        }
    } else if (sponoturl.test(string)) {
        try {
        return message.channel.send("유감스럽게도 `link.tospotify.com` 링크는 지원하지 않아요.")
        } catch (e) {
        return message.channel.send("유감스럽게도 `link.tospotify.com` 링크는 지원하지 않아요.")
        }
    } else if (!spourl.test(string) || !spoplurl.test(string) || !sponoturl.test(string)) {
    try {
        message.channel.send("<a:loading:775963839862145024> 로딩중..")
        client.distube.play(message, string)
    } catch (e) {
        message.channel.send(`에러TV)\`${e}\``)
    }
}
}
}

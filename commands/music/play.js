const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "재생",
    aliases: ["틀어", "노래"],
    description: "노래를 틀어줍니다",
    run: async (client, message, args) => {
        if (!message.member.voice.channel) return message.reply("보이스채널에 먼저 들어가셔야 해요.")
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.reply("저런, 저랑 같은 보이스채널에 계셔야 해요.")
        
        const nostring = new MessageEmbed()
            .setTitle("Hikari :heart:")
            .setColor("cbd0ed")
            .addField(`${client.config.prefix}재생 <URL/제목>`, "[수많은 사이트들을 지원해요!](https://ytdl-org.github.io/youtube-dl/supportedsites.html)\n**Spotify도 가능해요!**")
        const string = args.join(" ")
        if (!string) return message.reply({embeds: [nostring]}, { allowedMentions: { repliedUser: false }})
        message.channel.sendTyping()
        client.distube.play(message, string)
    }
}
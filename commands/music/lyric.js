const { KOKEN } = require("../../config.json")
const { MessageEmbed } = require("discord.js-light")
const { KSoftClient } = require("@ksoft/api")

module.exports = {
    name: "가사",
    aliases: [],
    description: "가사를 보여줘요",
    cooldown: "5",

    run: async (client, message, args) => {
        try {
            const helpembed = new MessageEmbed()
                .setTitle("Hikari :heart:")
                .setColor("RANDOM")
                .addField(`${client.prefix}가사 <노래 제목>", "알맞지 않은 가사가 나올수도 있어요.`)
                .setTimestamp()
            if (!args[0]) return message.channel.send(helpembed)
            const ava = message.author.displayAvatarURL({ dynamic: true, format: "png" })
            const string = args.join(" ")
            const msg = await message.channel.send(`\`${string}\`가사를 가져오고 있어요..`)
            const ksoft = new KSoftClient(KOKEN)
            const lyric = await ksoft.lyrics.get(string, false)
                .catch(err => {
                    return message.channel.send(`에러가 발생했습니다.\n\`${err}\` `)
                })

            if (!lyric.lyrics) return msg.delete()

            const embed = new MessageEmbed()
                .setTitle(`${lyric.name}`)
                .setAuthor(`${lyric.artist.name}`)
                .setDescription(`${lyric.lyrics.slice(0, 2044)}...`)
                .setFooter(`${message.author.tag} | KSoft.Si API를 사용하였습니다.`, ava)
                .setColor("RANDOM")

            msg.edit("", embed)
        } catch (e) {
            message.channel.send(`에러가 발생했습니다.\n\`${e}\``)
        }
    }
}

const { KOKEN } = require("../../config.json");
const { MessageEmbed } = require("discord.js");
const { KSoftClient } = require('@ksoft/api');

module.exports = {
  name: "가사",
  aliases: [],
  description: "가사를 보여줘요",
  cooldown: "5",

run: async (client, message, args) => {
    const ava = message.author.displayAvatarURL({ dynamic: true, format: "png" })
    const string = args.join(" ")
    const msg = await message.channel.send(`\`${string}\`가사를 가져오고 있어요..`)
    const ksoft = new KSoftClient(KOKEN)
    if (!args[0]) return message.channel.send("ㅑ가사 <노래 제목>")
    
    const lyric = await ksoft.lyrics.get(string, false)
    .catch(err => {
        return message.channel.send(`에러TV) \`${err}\` `);
    });

    if (!lyric.lyrics) return msg.delete()

    const embed = new MessageEmbed()
        .setTitle(`${lyric.name}`)
        .setAuthor(`${lyric.artist.name}`)
        .setDescription(`${lyric.lyrics.slice(0, 2044)}...`)
        .setFooter(`${message.author.tag} | KSoft.Si API를 사용하였습니다.`, ava)
        .setColor("RANDOM");
    
    msg.edit('', embed)
}
}
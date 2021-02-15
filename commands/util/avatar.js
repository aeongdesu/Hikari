const Discord = require("discord.js-light")

module.exports = {
    name: "프사",
    aliases: ["아바타", "프로필사진", "프사"],
    description: "프사를 보여줘요",
    cooldown: "5",
    run: async (client, message, args) => {
    // nogada
        const Avatar = message.author.displayAvatarURL({ dynamic: true, format: "png" })
        const Avatar128 = message.author.displayAvatarURL({ dynamic: true, format: "png", size: 128 })
        const Avatar256 = message.author.displayAvatarURL({ dynamic: true, format: "png", size: 256 })
        const Avatar512 = message.author.displayAvatarURL({ dynamic: true, format: "png", size: 512 })
        const Avatar1024 = message.author.displayAvatarURL({ dynamic: true, format: "png", size: 1024 })
        const Avatar2048 = message.author.displayAvatarURL({ dynamic: true, format: "png", size: 2048 })

        const embed = new Discord.MessageEmbed()
            .setTitle(`${message.author.tag}님의 프사에요!`)
            .setDescription(`[128](${Avatar128}) [256](${Avatar256}) [512](${Avatar512}) [1024](${Avatar1024}) [2048](${Avatar2048})`)
            .setImage(Avatar)
            .setColor("RANDOM")

        message.channel.send(embed)
    }
}

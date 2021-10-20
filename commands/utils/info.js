const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "봇정보",
    description: "봇 정보를 보여줍니다",
    cooldown: "5",
    run: async (client, message) => {
        const nostring = new MessageEmbed()
            .setTitle("Hikari :heart:")
            .setColor("cbd0ed")
            .setDescription(`웹소켓 핑: **\`${client.ws.ping}\`** ms`)
        message.reply({embeds: [nostring]})
    }
}
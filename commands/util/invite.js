const { MessageEmbed } = require("discord.js-light")

module.exports = {
    name: "초대",
    aliases: [],
    description: "히카리를 초대해요",
    cooldown: "5",
    run: async (client, message) => {
        const invite = new MessageEmbed()
            .setTitle("히카리 초대링크")
            .setColor("RANDOM")
            .setDescription("https://discord.com/oauth2/authorize?client_id=719163943330906143&scope=bot&permissions=3509312")
        invite.setTimestamp()

        return message.channel.send(invite).catch(console.error)
    }
}

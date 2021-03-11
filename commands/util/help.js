const { MessageEmbed } = require("discord.js-light")

module.exports = {
    name: "도움말",
    aliases: ["도움", "도와줘", "명령어"],
    description: "명령어들을 보여줘요",
    cooldown: "5",
    run: async (client, message) => {
        try {
            const commands = message.client.commands.array()

            const helpEmbed = new MessageEmbed()
                .setTitle("히카리 명령어")
                .setColor("RANDOM")

            commands.forEach((cmd) => {
                helpEmbed.addField(
                    `**${message.client.prefix}${cmd.name} (${cmd.aliases})**`,
                    `${cmd.description}`, true
                )
            })

            helpEmbed.setFooter("Bread#2635", null)

            return message.channel.send(helpEmbed)
        } catch (e) {
            client.logger.error(e)
        }
    }
}

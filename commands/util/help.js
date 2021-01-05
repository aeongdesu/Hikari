const { MessageEmbed } = require("discord.js-light");

module.exports = {
  name: "도움말",
  aliases: ["도움", "도와줘", "명령어"],
  description: "명령어들을 보여줘요",
run: async (client, message, args) => {
    let commands = message.client.commands.array();

    let helpEmbed = new MessageEmbed()
      .setTitle("Hikari Help :heart:")
      .setColor("RANDOM");

    commands.forEach((cmd) => {
      helpEmbed.addField(
        `**${message.client.prefix}${cmd.name} (${cmd.aliases})**`,
        `${cmd.description}`, true
      )
    });


    helpEmbed.setTimestamp();

    return message.channel.send(helpEmbed).catch(console.error);
  }
};

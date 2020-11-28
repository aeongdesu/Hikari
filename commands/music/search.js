const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "검색",
  aliases: ["찾아"],
  description: "노래를 찾아줘요",
  cooldown: "5",
run: async (client, message, args) => {
    message.channel.send("제작중이므로 `ㅑ재생` 명령어를 이용해주세요!")
}
}
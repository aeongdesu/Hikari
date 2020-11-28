module.exports = {
    name: "정지",
    aliases: ["멈춰"],
    description: "듣기 싫어!!!",
    run: async (client, message, args) => {
      if (!message.member.voice.channel) return message.channel.send("보이스채널에 먼저 들어가셔야 해요!")
      if (!client.distube.isPlaying(message)) return message.channel.send("듣고 계신거 맞죠?!")
      message.react('👌');
      client.distube.stop(message);
    }
  }
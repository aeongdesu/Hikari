module.exports = {
    name: "자동재생",
    aliases: ["알고리즘"],
    description: "모든건 알고리즘에 맡겠다",
    run: async (client, message) => {
      if (!message.member.voice.channel) return message.channel.send("보이스채널에 먼저 들어가셔야 해요!")
      if (!client.distube.isPlaying(message)) return message.channel.send("듣고 계신거 맞죠?!")
      let mode = client.distube.addRelatedVideo(message);
      message.channel.send(`자동재생이 ${(mode ? "켜졌어요!" : "꺼졌어요!")}`);
    }
  }
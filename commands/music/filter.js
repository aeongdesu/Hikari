module.exports = {
    name: "필터",
    description: "노래에다 필터를 넣어요",
    aliases: [],
    cooldown: "3",
    run: async (client, message, args) => {
        if (!message.member.voice.channel) return message.channel.send("보이스채널에 먼저 들어가셔야 해요.")
        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send("대기열에 노래가 없어요.")
        if ((args[0] === "끄기" || args[0] === "off") && queue.filter) client.distube.setFilter(message, queue.filter)
        else if (Object.keys(client.distube.filters).includes(args[0])) client.distube.setFilter(message, args[0])
        else if (args[0]) return message.channel.send("https://bread.shx.gg/LWn1pn.png")
        message.channel.send(`현재 필터 상태: \`${queue.filter || "꺼짐"}\``)
    }
}

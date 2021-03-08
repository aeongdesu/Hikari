module.exports = {
    name: "필터",
    description: "노래에다 필터를 넣어요",
    aliases: [],
    cooldown: "3",
    run: async (client, message, args) => {
        try {
            if (!message.member.voice.channel) return message.channel.send("보이스채널에 먼저 들어가셔야 해요.")
            const queue = client.distube.getQueue(message)
            if (!queue) return message.channel.send("대기열에 노래가 없어요.")
            const songislive = queue.songs[0].isLive
            if (songislive === true) return message.channel.send("생방송은 여러 문제로 인하여 필터 적용이 불가합니다.")
            if ((args[0] === "끄기" || args[0] === "off") && queue.filter) client.distube.setFilter(message, queue.filter)
            else if (Object.keys(client.distube.filters).includes(args[0])) client.distube.setFilter(message, args[0])
            else if (!args[0] || !Object.keys(client.distube.filters).includes(args[0])) return message.channel.send(`현재 필터 상태: \`${queue.filter || "꺼짐"}\`\nhttps://bread.shx.gg/LWn1pn.png`)
            message.channel.send(`현재 필터 상태: \`${queue.filter || "꺼짐"}\``)
        } catch (e) {
            message.channel.send(`에러가 발생했습니다.\n\`${e}\``)
        }
    }
}

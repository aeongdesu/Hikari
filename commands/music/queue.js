module.exports = {
    name: "대기",
    aliases: ["대기열", "목록"],
    description: "대기열을 보여줘요",
    cooldown: "5",
    run: async (client, message) => {
        try {
            const queue = client.distube.getQueue(message)
            if (!queue) return message.channel.send("대기열에 노래가 없어요!")
            const q = queue.songs.map((song, i) => {
                return `${i === 0 ? `- 재생중: ${song.name} [${song.formattedDuration}]\n` : `${i}. ${song.name} [${song.formattedDuration}]`}`
            }).join("\n")
            message.channel.send(`# 대기열\n\n${q}`, { code: "markdown" })
        } catch (e) {
            message.channel.send(`에러가 발생했습니다.\n\`${e}\``)
        }
    }
}

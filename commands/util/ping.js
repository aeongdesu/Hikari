module.exports = {
    name: "핑",
    aliases: [],
    description: "히카리의 핑을 확인해요",
    cooldown: "5",
    run: async (client, message, args) => {
        const ping = Math.round(client.ws.ping)
        if (ping <= 250) message.channel.send(`${ping}ms, 괜찮은 응답이에요!`)
        if (ping > 250) message.channel.send(`${ping}ms, 조금 늦게 응답할 수도 있어요!`)
    }
}

module.exports = {
    run: async (client, interaction, message, queue) => {
        if (!queue) return
        if (interaction.user !== queue.songs[0].user) return interaction.reply({ content: "노래를 튼 사람만 조작할 수 있어요!", ephemeral: true })
        if (!queue.autoplay && !queue.previousSongs.length) return interaction.reply({ 
            content: `다음 곡이 없어요!
        >   \`${client.config.prefix}자동재생\` 명령어로 다음곡을 추천드릴 수 있어요.`,
            ephemeral: true
        })

        queue.skip()
        return interaction.reply("다음 곡을 재생할게요!")
    }
}
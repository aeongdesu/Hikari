module.exports = {
    run: async (client, interaction, message, queue) => {
        if (!queue) return
        if (interaction.user !== queue.songs[0].user) return interaction.reply({ content: "노래를 튼 사람만 조작할 수 있어요!", ephemeral: true })
        if (!queue.previousSongs.length) return interaction.reply({content: "이전 곡이 없어요!", ephemeral: true })
        
        await queue.previous()
        return await interaction.reply("이전 곡을 재생할게요!")
    }
}
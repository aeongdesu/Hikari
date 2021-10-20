module.exports = {
    run: async (client, interaction, message, queue) => {
        if (!queue) return
        if (interaction.user !== queue.songs[0].user) return interaction.reply({ content: "노래를 튼 사람만 조작할 수 있어요!", ephemeral: true })
        
        await queue.stop()
        return await interaction.update({components: []})
    }
}
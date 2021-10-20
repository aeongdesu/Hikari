
module.exports = {
    name: "도움말",
    aliases: ["도움", "명령어"],
    description: "명령어를 보여줍니다",
    usage: "도움말 <명령어>",
    cooldown: "5",
    run: async (client, message) => {
        message.reply("현재 `재생`, `정지`, `필터`, `반복` 기능만 사용하실 수 있습니다.")
    }
}
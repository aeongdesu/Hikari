const Discord = require("discord.js")
const fs = require("fs")
const buttonHandler = require("../utils/buttons")

module.exports = (client, DokdoHandler) => {
    fs.readdirSync("./commands/").forEach((dir) => {
        const commands = fs.readdirSync(`./commands/${dir}/`).filter((file) => file.endsWith(".js"))
        if (commands.length <= 0) return console.log("명령어를 찾을 수 없어요!")
        for (let file of commands) {
            let cmds = require(`../commands/${dir}/${file}`)
            if (cmds.name) {
                client.commands.set(cmds.name, cmds)
                console.log(`[commands] ${cmds.name} Loaded`)
            }
            if (cmds.aliases && Array.isArray(cmds.aliases)) cmds.aliases.forEach((alias) => client.aliases.set(alias, cmds.name))
        }
    })

    client
        .on("ready", () => {
            console.log(`[client] ${client.user.username} ready!`)
            setInterval(() => {
                const server = client.guilds.cache.size
                const cstatuslist = [
                    `${client.config.prefix}도움`,
                    `${client.config.prefix}초대`,
                    `${server} 서버`
                ]
                const index = Math.floor(Math.random() * cstatuslist.length)
                client.user.setActivity(cstatuslist[index] + " | 보이스채널", { type: "COMPETING" })
            }, 8000)
        })

    //  .on("debug", (info) => console.log(info))
        .on("warn", (info) => console.warn(info))
        .on("error", (error) => console.error(error))

        .on("messageCreate", async message => {
            if (!message.guild || message.author.bot || message.channel.type === "dm") return
            const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")
            const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(client.config.prefix)})\\s*`, "u")
            if (!prefixRegex.test(message.content)) return

            const [, matchedPrefix] = message.content.match(prefixRegex)

            const args = message.content.slice(matchedPrefix.length).trim().split(/ +/u)
            const commandName = args.shift().toLowerCase()

            DokdoHandler.run(message)

            const command =
            client.commands.get(commandName) ||
            client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName))

            if (!command) return

            if (!client.cooldowns.has(command.name)) {
                client.cooldowns.set(command.name, new Discord.Collection())
            }

            const now = Date.now()
            const timestamps = client.cooldowns.get(command.name)
            const cooldownAmount = (command.cooldown || 3) * 1000 // set or 3 seconds (default)

            if (timestamps.has(message.author.id)) {
                const expirationTime = timestamps.get(message.author.id) + cooldownAmount

                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000
                    return message.reply(
                        `\`${command.name}\` 명령어는 ${timeLeft.toFixed(1)}초 뒤에 다시 사용하실수 있어요! :pensive:`
                    )
                }
            }

            timestamps.set(message.author.id, now)
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)

            try {
                return command.run(client, message, args)
            } catch (error) {
                console.error(error)
                message.reply(`에러가 발생했습니다.\n${error}`).catch(console.error)
            }
        })
        .on("interactionCreate", async interaction => {
            const { message, customId } = interaction
            if (!interaction.isButton() || customId.includes("dokdo$")) return
            const buttonCommand = buttonHandler[customId]
            const queue = client.distube.getQueue(message)
            return buttonCommand.run(client, interaction, message, queue)
        })
    client.login(client.config.token)
}
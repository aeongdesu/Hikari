const Discord = require("discord.js")
const client = new Discord.Client({
    disableEveryone: true,
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES", "GUILD_MESSAGE_TYPING"]
})
const fs = require("fs")
const Dokdo = require("dokdo")

client.config = require("./config.json")
client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()
client.categories = fs.readdirSync("./commands/")
client.cooldowns = new Discord.Collection()
const DokdoHandler = new Dokdo(client, { aliases: ["eval", "dok"], prefix: client.config.prefix })

const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"))
for (const file of eventFiles) {
    if (file === "koreanbots.js") return console.log(`[ignore events] ${file} Not Loaded`)
    require(`./events/${file}`)(client, DokdoHandler)
    console.log(`[events] ${file} Loaded`)
}
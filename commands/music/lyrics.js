const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");

module.exports = {
    name: "lyrics",
    category: "music",
    aliases: [ "ly" ],
    description: "Lyric Music",
    args: false,
    usage: "",
    permission: [],
    owner: false,
    inVoiceChannel: false,
    sameVoiceChannel: false,
    async execute(message, args) {
        const queue = message.client.distube.getQueue(message);

        if(!queue) {
            let thing = new MessageEmbed()
                .setColor("RANDOM")
                .setDescription(`There is no music playing.`);
            return message.channel.send(thing);
        }

        let song = args.join(" ");
        if (!song && queue.song[0]) song = queue.song[0].name;

        let lyrics = null;

        try {
            lyrics = await lyricsFinder(song, "");
            if (!lyrics) lyrics = `No lyrics found.`;
        } catch (error) {
            console.error(error)
            lyrics = `Usage: ${message.client.prefix}ly <Song Name>`;
        }

        let lyricsEmbed = new MessageEmbed()
            .setColor(message.client.color)
            .setAuthor(message.client.user.username, message.client.user.displayAvatarURL())
            .setDescription(`**Lyrics** of **${song}**\n${lyrics}`)
            .setFooter(`Request by: ${message.author.tag}`);

        if (lyricsEmbed.description.length >= 2048)
        lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
        return message.channel.send(lyricsEmbed);
    }
}

module.exports = {
    name: "이발",
    aliases: [],
    description: "봇 개발자용",
  run: async (client, message, args) => {
    const clean = text => {
        if (typeof(text) === "string")
          return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else
            return text;
      }
    const { OWNERID } = require("../../config.json");
    if(message.author.id !== OWNERID) return;
     try {
        const code = args.join(" ");
        let evaled = eval(code);
 
        if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);
 
        message.channel.send(clean(evaled), {code:"js", split: true})
        } catch (err) {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
}
}
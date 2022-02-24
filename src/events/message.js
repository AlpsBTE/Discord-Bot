const BaseEvent = require("../classes/Event");
const { MessageEmbed, Message, MessageActionRow, MessageButton } = require("discord.js")
const Bot = require("../classes/Bot.js");

class MessageEvent extends BaseEvent {
    constructor() {
        super('messageCreate');
    };

    /**
     * @param {Bot} client 
     * @param {Message} msg 
     */

    async run(client, msg) {
        if(msg.author.bot) return;
        if(!msg.guild) return msg.reply({ content: ":x: This bot only works on guilds.", components: [ new MessageActionRow().addComponents(new MessageButton().setStyle("LINK").setLabel("BTE Germany Server").setURL("https://discord.com/channels/692825222373703772/742824476869132328"))]})

        // suggestions
        if(msg.channel.id === client.config.suggestionsChannel) {
            if(msg.author.bot) return;
            
            let suggestionsCount = await client.schemas.suggestion.countDocuments()
            let suggId = suggestionsCount+1;

            let suggestionEmbed = new MessageEmbed()
                .setFooter({ text: "© ALPS BTE", iconURL: msg.guild.iconURL({ dynamic: true })})
                .setTimestamp().setColor("#9cada9")
                .setAuthor({ name: msg.member?.nickname?.split(" [")?.[0] || msg.author.username, iconURL: msg.author.avatarURL({ dynamic: true }) })
                .setDescription(`**#${suggId}** - ${msg.content.trim()}`)
                .addField("Status", "Open", false)

            // send suggestion embed
            msg.channel.send({ embeds: [ suggestionEmbed ]}).then(async message => {
                let suggestionDb = new client.schemas.suggestion({
                    id: suggId,
                    userid: msg.author.id,
                    messageid: message.id
                });

                // start suggestuion thread
                await message.startThread({
                    name: `${suggId} - Discussion`,
                    reason: "Suggestion discussion",
                    autoArchiveDuration: "MAX"
                }).catch(client.Logger.warn)

                // ghost ping in thread
                message?.thread?.send(`<@!${msg.author.id}>`).then(mp => mp.delete().catch(e => {})).catch(e => {})

                // save suggestion db
                await suggestionDb.save();

                // delete original message
                msg.delete().catch(client.Logger.error);

                // dm embed
                let suggCreatedEmbed = new MessageEmbed()
                    .setDescription(`You're suggestion (\`${suggId}\`) in ${msg.guild.name} was created, you can find it [here](${message.url}).`)
                    .setColor("GREEN")

                // dm
                msg.member.send({ embeds: [ suggCreatedEmbed ] }).catch(e => { });

                // reactions
                message.react("👍");
                message.react("👎");
            })

        }
    };
};

module.exports = MessageEvent;
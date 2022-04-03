import Event from "../classes/Event";
import {
  MessageEmbed,
  Message,
  MessageActionRow,
  MessageButton,
} from "discord.js";
import Bot from "../classes/Bot";

class MessageEvent extends Event {
  constructor(client: Bot) {
    super("messageCreate", client);
  }

  async run(client: Bot, msg: Message) {
    if (msg.author.bot) return;
    if (!msg.guild)
      return msg.reply({
        content: ":x: This bot only works on guilds.",
        components: [
          new MessageActionRow().addComponents(
            new MessageButton()
              .setStyle("LINK")
              .setLabel("Alps BTE Server")
              .setURL(
                "https://discord.com/channels/692825222373703772/742824476869132328"
              )
          ),
        ],
      });

    // suggestions
    if (msg.channel.id === client.config.suggestionsChannel) {
      if (msg.author.bot) return;

      const suggestionsCount = await client.schemas.suggestion.countDocuments();
      const suggId = suggestionsCount + 1;

      const suggestionEmbed = new MessageEmbed()
        .setFooter({
          text: "© ALPS BTE",
          iconURL: msg.guild.iconURL({ dynamic: true }) || undefined,
        })
        .setTimestamp()
        .setColor("#9cada9")
        .setAuthor({
          name: msg.member?.nickname?.split(" [")?.[0] || msg.author.username,
          iconURL: msg.author.avatarURL({ dynamic: true }) || undefined,
        })
        .setDescription(`**#${suggId}** - ${msg.content.trim()}`)
        .addField("Status", "Open", false);

      // send suggestion embed
      msg.channel.send({ embeds: [suggestionEmbed] }).then(async (message) => {
        const suggestionDb = new client.schemas.suggestion({
          id: suggId,
          userid: msg.author.id,
          messageid: message.id,
        });

        // start suggestuion thread
        await message
          .startThread({
            name: `${suggId} - Discussion`,
            reason: "Suggestion discussion",
            autoArchiveDuration: "MAX",
          })
          .catch(client.Logger.warn);

        // ghost ping in thread
        message?.thread
          ?.send(`<@!${msg.author.id}>`)
          .then((mp) => mp.delete().catch())
          .catch();

        // save suggestion db
        await suggestionDb.save();

        // delete original message
        msg.delete().catch(client.Logger.error);

        // dm embed
        const suggCreatedEmbed = new MessageEmbed()
          .setDescription(
            `You're suggestion (\`${suggId}\`) in ${msg.guild?.name} was created, you can find it [here](${message.url}).`
          )
          .setColor("GREEN");

        // dm
        msg.member?.send({ embeds: [suggCreatedEmbed] }).catch();

        // reactions
        message.react("👍");
        message.react("👎");
      });
    }
  }
}

export default MessageEvent;

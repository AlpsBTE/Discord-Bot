import { MessageEmbed, CommandInteraction } from "discord.js";
import Bot from "../../classes/Bot";
import Command from "../../classes/Command";

class AcceptCommand extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "accept",
      description: "Accepts a suggestion",
      userAvailable: false,
      options: [
        {
          name: "suggestion-id",
          description: "The ID of the Suggestion to accept",
          type: 10,
          required: true,
        },
        {
          name: "text",
          description: "text",
          type: 3,
          required: true,
        },
      ],
    });
  }

  async run(interaction: CommandInteraction, client: Bot): Promise<any> {
    const options = interaction.options;
    const args = options.data;

    const suggestionId = args[0]?.value;
    const acceptText = args[1]?.value;

    if (!suggestionId || !acceptText) return;

    const suggestionDb = await this.client.schemas.suggestion.findOne({
      id: suggestionId,
      status: { $ne: "deleted" },
    });
    if (!suggestionDb)
      return this.error(
        interaction,
        `Es gibt keine Suggestion mit der ID \`${suggestionId}\`!`
      );

    const suggestionChannel =
      this.client.channels.cache.get(this.client.config.suggestionsChannel) ||
      (await this.client.channels
        .fetch(client.config.suggestionsChannel)
        .catch(this.Logger.error));
    if (!suggestionChannel)
      return this.error(
        interaction,
        "Der Suggestion Kanal konnte nicht geladen werden."
      );

    if (suggestionChannel.type != "GUILD_TEXT") return;
    const suggestionMessage = await suggestionChannel.messages
      .fetch(suggestionDb.messageid)
      .catch(this.Logger.error);
    if (!suggestionMessage)
      return this.error(
        interaction,
        "Die Nachricht zu dieser Suggestion konnte nicht gefunden werden."
      );

    const suggEmbed = suggestionMessage.embeds[0];

    const newSuggEmbed = suggEmbed;
    newSuggEmbed.fields = [];

    newSuggEmbed
      .addField(
        "Status:",
        `Accepted (${acceptText})\n~ ${interaction.user.tag}`
      )
      .setColor("GREEN");

    suggestionMessage.edit({ embeds: [newSuggEmbed] }).catch((e) => {
      client.Logger.error(e);
      return this.error(
        interaction,
        "Unknown error occurred. (`Wasn't able to fetch message`)"
      );
    });

    suggestionDb.status = "accepted";
    suggestionDb.closed = new Date().getTime();
    await suggestionDb.save();

    const suggUser =
      client.users.cache.get(suggestionDb.userid) ||
      (await client.users
        .fetch(suggestionDb.userid)
        .catch(client.Logger.error));
    if (suggUser)
      suggUser
        .send({
          embeds: [
            new MessageEmbed()
              .setDescription(
                `Your suggestion (\`${suggestionId}\`) in ${suggestionMessage.guild?.name} was accepted, you can find it [here](${suggestionMessage.url}).`
              )
              .setColor("GREEN"),
          ],
        })
        .catch();

    return this.response(
      interaction,
      this.embed.setDescription(`Suggestion ${suggestionId} was accepted.`)
    );
  }
}

export default AcceptCommand;

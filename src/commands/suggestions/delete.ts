import { CommandInteraction } from "discord.js";
import Bot from "../../classes/Bot";
import Command from "../../classes/Command";

class AcceptCommand extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "delete",
      description: "Deletes a suggestion",
      userAvailable: false,
      options: [
        {
          name: "suggestion-id",
          description: "The ID of the Suggestion to delete",
          type: 10,
          required: true,
        },
      ],
    });
  }

  async run(interaction: CommandInteraction, client: Bot): Promise<any> {
    const options = interaction.options;
    const args = options.data;

    const suggestionId = args.find((x) => x.name === "suggestion-id")?.value;

    if (!suggestionId) return;

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

    if (suggestionMessage.hasThread) {
      await suggestionMessage.thread
        ?.delete(`Suggestion Deleted`)
        .catch(client.Logger.error);
    }

    await suggestionMessage.delete().catch(client.Logger.warn);

    suggestionDb.status = "deleted";
    suggestionDb.closed = new Date().getTime();
    await suggestionDb.save();

    return this.response(
      interaction,
      this.embed.setDescription(`Suggestion ${suggestionId} was deleted.`)
    );
  }
}

export default AcceptCommand;

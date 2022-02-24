import { MessageEmbed, CommandInteraction, Message } from "discord.js";
import { BaseCommand } from "../../classes/Command";
import Bot from "../../classes/Bot";
class AcceptCommand extends BaseCommand {
  client: any;
  private _embed: any;
    public get embed(): any {
        return this._embed;
    }
    public set embed(value: any) {
        this._embed = value;
    }
  response: any;
  Logger: any;
  constructor(client) {
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

  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Bot} client
   */

  async run(interaction, client) {
    const options = interaction.options;
    const args = options.data;

    let suggestionId = args.find((x) => x.name === "suggestion-id")?.value;

    if (!suggestionId) return;

    let suggestionDb = await this.client.schemas.suggestion.findOne({
      id: suggestionId,
      status: { $ne: "deleted" },
    });
    if (!suggestionDb)
      return this.error(
        interaction,
        `Es gibt keine Suggestion mit der ID \`${suggestionId}\`!`
      );

    let suggestionChannel =
      this.client.channels.cache.get(this.client.config.suggestionsChannel) ||
      (await this.client.channels
        .fetch(client.config.suggestionsChannel)
        .catch(this.Logger.error));
    if (!suggestionChannel)
      return this.error(
        interaction,
        "Der Suggestion Kanal konnte nicht geladen werden."
      );

    /**
     * @type {Message}
     */
    let suggestionMessage = await suggestionChannel.messages
      .fetch(suggestionDb.messageid)
      .catch(this.Logger.error);
    if (!suggestionMessage)
      return this.error(
        interaction,
        "Die Nachricht zu dieser Suggestion konnte nicht gefunden werden."
      );

    if (suggestionMessage.hasThread) {
      await suggestionMessage.thread
        .delete(`Suggestion Deleted`)
        .catch(client.Logger.error);
    }

    await suggestionMessage.delete().catch(client.Logger.warn);

    suggestionDb.status = "deleted";
    suggestionDb.closed = new Date().getTime();
    await suggestionDb.save();

    let suggUser =
      client.users.cache.get(suggestionDb.userid) ||
      (await client.users
        .fetch(suggestionDb.userid)
        .catch(client.Logger.error));

    return this.response(
      interaction,
      new this.embed().setDescription(`Suggestion ${suggestionId} was deleted.`)
    );
  }
  error(interaction: any, arg1: string) {
    throw new Error("Method not implemented.");
  }
}

module.exports = AcceptCommand;

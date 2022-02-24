import { MessageEmbed, CommandInteraction, Message } from "discord.js";
import Bot from "../../classes/Bot";
import BaseCommand from "../../classes/Command";

class InprocessCommand extends BaseCommand {
  client: any;
  Logger: any;
  private _embed: any;
  public get embed(): any {
    return this._embed;
  }
  public set embed(value: any) {
    this._embed = value;
  }
  constructor(client) {
    super(client, {
      name: "inprocess",
      description: "Inprocesses a suggestion",
      userAvailable: false,
      options: [
        {
          name: "suggestion-id",
          description: "The ID of the Suggestion to inprocess",
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

  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Bot} client
   */
  // @ts-ignore
  async run(interaction: CommandInteraction, client: Bot) {
    const options = interaction.options;
    const args = options.data;

    let suggestionId = args[0]?.value;
    let considerText = args[1]?.value;

    if (!suggestionId || !considerText) return;

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

    let suggEmbed = suggestionMessage.embeds[0];

    let newSuggEmbed = suggEmbed;
    newSuggEmbed.fields = [];

    newSuggEmbed
      .addField(
        "Status:",
        `Inprocess (${considerText})\n~ ${interaction.user.tag}`
      )
      .setColor("ORANGE");

    suggestionMessage.edit({ embeds: [newSuggEmbed] }).catch((e) => {
      client.Logger.error(e);
      return this.error(
        interaction,
        "Unknown error occured. (`Wasn't able to fetch message`)"
      );
    });

    suggestionDb.status = "inrpocess";
    suggestionDb.closed = new Date().getTime();
    await suggestionDb.save();

    let suggUser =
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
                `You're suggestion (\`${suggestionId}\`) in ${suggestionMessage.guild.name} was set to inprocess, you can find it [here](${suggestionMessage.url}).`
              )
              .setColor("ORANGE"),
          ],
        })
        .catch((e) => {});

    return this.response(
      interaction,
      new this.embed().setDescription(
        `Suggestion ${suggestionId} was inprocessed.`
      )
    );
  }
  // @ts-ignore
  response(interaction: any, arg1: any) {
    throw new Error("Method not implemented.");
  }
  error(interaction: any, arg1: string) {
    throw new Error("Method not implemented.");
  }
}

module.exports = InprocessCommand;

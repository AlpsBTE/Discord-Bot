import { MessageEmbed, CommandInteraction } from "discord.js";
import Event from "../classes/Event";
import Bot from "../classes/Bot";

class InteractionEvent extends Event {
  constructor(client: Bot) {
    super("interactionCreate", client);
  }

  async run(client: Bot, interaction: CommandInteraction) {
    if (interaction.type === "APPLICATION_COMMAND") {
      const command = client.commands.get(interaction.commandName);
      if (!command)
        return await interaction.reply({
          ephemeral: true,
          content: ":x: This command wasn't found.",
        });

      if (Array.isArray(interaction.member?.roles)) return;
      if (
        !command.config.userAvailable &&
        !interaction.member?.roles.cache.get(client.config.roles.team)
      )
        return await interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor("#ff0000")
              .setDescription(
                ":x: You don't have the required permissions to use this command."
              ),
          ],
        });

      await interaction.deferReply().catch((e) => {
        return client.Logger.error(e);
      });

      return command.run(interaction, client);
    }
  }
}

export default InteractionEvent;

import {
  ApplicationCommandOptionData,
  CommandInteraction,
  MessageActionRow,
  MessageEmbed,
} from "discord.js";
import Logger from "../utils/Logger";
import Bot from "./Bot";

export interface Permission {
  id: string;
  type: "ROLE" | "USER";
  permission: boolean;
}

export interface CommandOptions {
  name: string;
  description: string;
  userAvailable: boolean;
  permissions?: Permission[];
  options: ApplicationCommandOptionData[];
}

class Command {
  client: Bot;
  config: {
    name: string;
    description: string;
    userAvailable: boolean;
    permissions: Permission[];
    options: ApplicationCommandOptionData[];
  };
  help: { name: string; description: string; userAvailable: boolean };
  Logger: Logger;
  data: {
    name: string;
    description: string;
    options: ApplicationCommandOptionData[];
  };
  constructor(
    client: Bot,
    {
      name = "Beispiel Command",
      description = "",

      userAvailable = true,

      permissions = [
        {
          id: "700788505936396388", // mods // 700788505936396388
          type: "ROLE",
          permission: true,
        },
      ],

      options = [],
    }: CommandOptions
  ) {
    this.client = client;

    this.config = { name, description, userAvailable, permissions, options };
    this.help = { name, description, userAvailable };
    this.data = {
      name: this.help.name,
      description: this.help.description,
      options: this.config.options,
    };
    this.Logger = client?.Logger;
  }

  get embed(): MessageEmbed {
    const embed = new MessageEmbed().setTimestamp().setFooter({
      text: "Alps BTE",
      iconURL:
        "https://cdn.discordapp.com/icons/696795397376442440/a_65cf5b07b37f35fb0a69926b4946662f.gif?size=256",
    });

    embed.color = 4605931;
    return embed;
  }

  async run(interaction: CommandInteraction, client: Bot): Promise<void> {
    this.Logger.warn(
      "Ended up in command.js [" +
        JSON.stringify(client.config) +
        " - " +
        interaction.id +
        "]"
    );
  }

  async response(
    interaction: CommandInteraction,
    input: string | MessageEmbed | MessageEmbed[],
    components?: MessageActionRow
  ): Promise<any> {
    // APIMessage | Message<boolean> | void> | PromiseLike<void
    if (typeof input === "object" && !Array.isArray(input)) {
      if (input.description || input.title)
        return await interaction
          .editReply({
            embeds: [input],
            components: components?.components ? [components] : [],
          })
          .catch(this.client.Logger.error);
      else if (Array.isArray(input))
        return await interaction
          .editReply({
            embeds: input,
            components: components?.components ? [components] : [],
          })
          .catch(this.client.Logger.error);
    } else if (typeof input === "string") {
      return await interaction
        .editReply({
          content: input,
          components: components?.components ? [components] : [],
        })
        .catch(this.client.Logger.error);
    }
  }

  async error(interaction: CommandInteraction, text: string): Promise<any> {
    return await interaction.editReply({
      embeds: [
        new MessageEmbed().setColor("#ff0000").setDescription(":x: " + text),
      ],
    });
  }
}

export default Command;

import { MessageEmbed } from "discord.js";

class BaseCommand {
  client: any;
  config: {
    userAvailable: boolean;
    options: any[];
    permissions: {
      id: string; // mods // 700788505936396388
      type: string;
      permission: boolean;
    }[];
    queries: any[];
    staffDc: boolean;
  };
  help: { name: string; description: string; aliases: any[] };
  Logger: any;
  constructor(
    client,
    {
      description = "",
      name = "Beispiel Command",

      userAvailable = true,

      permissions = [
        {
          id: "700788505936396388", // mods // 700788505936396388
          type: "ROLE",
          permission: true,
        },
      ],

      staffDc = false,

      aliases = [],

      options = [],

      queries = [],
    }
  ) {
    /**
     * The {@link Bot} the Command belongs to.
     * @type {Bot}
     */
    this.client = client;

    this.config = { userAvailable, options, permissions, queries, staffDc };
    this.help = { name, description, aliases };
    this.Logger = client?.Logger;
  }

  get embed() {
    return class extends MessageEmbed {
      constructor(options) {
        super(options);
        this.color = parseInt("#347aeb", 16);
        this.timestamp = Date.now();
        this.footer = {
          text: "ALPS BTE",
          iconURL:
            "https://cdn.discordapp.com/icons/696795397376442440/a_65cf5b07b37f35fb0a69926b4946662f.gif?size=256",
        };
      }
    };
  }

  /**
   *
   * @param {CommandInteraction} interaction
   */

  async run(interaction) {
    this.Logger.warn(
      "Ended up in command.js [" + JSON.stringify(this.config) + "]"
    );
  }

  /**
   *
   * @param {String} query
   */

  async queryHandler(query) {
    this.Logger.warn(
      "Ended up in command.js [" + JSON.stringify(this.config) + "]"
    );
    return [];
  }

  /**
   *
   * @param {String} guildId
   */

  async initialize(guildId) {
    let guild = await this.client.guilds.fetch(guildId);

    if (this.config.userAvailable)
      this.config.permissions.push({
        id: this.client.config.roles.rules, // user (rules) // 709805597863968799
        type: "ROLE",
        permission: true,
      });

    guild.commands
      .create({
        name: this.help.name,
        description: this.help.description,
        defaultPermission: false,
        options: this.config.options,
      })
      .then((cmd) => {
        let perms = this.config.permissions;
        cmd.permissions
          .add({ command: cmd.id, permissions: perms })
          .then(() => {
            this.Logger.info(`Created /${this.help.name}`, "COMMANDS");
          });
      })
      .catch(this.client.Logger.error);
  }

  delete() {
    this.rest
      .applications(this.client.user.id)
      .guilds(this.client.config.guild)
      .commands.post({
        data: {
          name: this.help.name,
          description: this.help.description,
          options: this.config.options,
        },
      })
      .catch((e) => {
        console.log(e);
      });
  }

  /**
   *
   * @param {[MessageEmbed, String, Array]} input
   * @param {Array} components
   * @returns
   */

  async response(interaction, input, components = []) {
    if (typeof input === "object") {
      if (input.description)
        return await interaction
          .editReply({ embeds: [input], components: components })
          .catch(this.client.Logger.error);
      else
        return await interaction
          .editReply({ embeds: input, components: components })
          .catch(this.client.Logger.error);
    } else if (typeof input === "string") {
      return await interaction
        .editReply({ content: input, components: components })
        .catch(this.client.Logger.error);
    }
  }

  /**
   *
   * @param {String} text
   * @returns
   */

  error(interaction, text) {
    return interaction
      .editReply({
        embeds: [
          new MessageEmbed().setColor("#ff0000").setDescription(":x: " + text),
        ],
      })
      .catch(this.client.Logger.error);
  }

  get rest() {
    return this.client.api;
  }
}

export default BaseCommand;

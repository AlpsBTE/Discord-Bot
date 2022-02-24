const { MessageEmbed, CommandInteraction } = require("discord.js");
const BaseEvent = require("../classes/Event.js");
const Bot = require("../classes/Bot.js");

class InteractioEvent extends BaseEvent {
    constructor() {
        super('interactionCreate');
    };

    /**
     * 
     * @param {Bot} client 
     * @param {CommandInteraction} interaction 
     */

    async run(client, interaction) {
        if(interaction.type === "APPLICATION_COMMAND") {
            let command = client.commands.get(interaction.commandName)
            if(!command) return await interaction.reply({ ephemeral: true, content: ":x: This command wasn't found."})

            if(!command.config.userAvailable && !interaction.member.roles.cache.get(client.config.roles.team)) return await interaction.reply({ ephemeral: true, embeds: [ new MessageEmbed().setColor("#ff0000").setDescription(":x: You don't have the required permissions to use this command.")]})

            await interaction.deferReply().catch(e => {
                return client.Logger.error(e);
            });

            return command.run(interaction, client)
        } else if(interaction.type === "APPLICATION_COMMAND_AUTOCOMPLETE") {
            let command = client.commands.get(interaction.commandName)
            if(!command) return

            let query = interaction.options._hoistedOptions.find(x => x.focused === true)?.value;
            let queries = command.queryHandler(query);
            while(queries.length > 25) queries.pop();

            return await client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 8,
                    data: {
                        choices: queries,
                    },
                },
            });
        };
    };
};

module.exports = InteractioEvent;
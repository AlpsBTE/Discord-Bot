import BaseEvent = require("../classes/Event.js");
import Bot = require("../classes/Bot.js");

export default class extends BaseEvent {
    constructor() {
        super('ready');
    };

    /**
     * 
     * @param {Bot} client 
     */

    async run(client) {
        client.Logger.info(`Logged in at ${new Date().toLocaleString().replace(",","")} as ${client.user.tag} [${client.user.id}]`, "CLIENT");

        client.commands.forEach(command => {
            if(command.config.staffDc) {
           //     command.initialize(client.config.staffDc.id);
                return;
            }       
         //   command.initialize(client.config.guild);
        });

        client.user.setPresence({ activities: [{ name: 'on BTE-Germany.de', type: "PLAYING" }], status: 'online', afK: false });
    };
};
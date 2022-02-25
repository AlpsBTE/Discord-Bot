import BaseEvent from "../classes/Event";
import Bot from "../classes/Bot";

export default class extends BaseEvent {
  constructor() {
    super("ready");
  }

  /**
   *
   * @param {Bot} client
   */

  async run(client: Bot) {
    client.Logger.info(
      `Logged in at ${new Date().toLocaleString().replace(",", "")} as ${
        client.user.tag
      } [${client.user.id}]`,
      "CLIENT"
    );
    /*
    client.commands.forEach((command) => {
      if (command.config.staffDc) {
        //     command.initialize(client.config.staffDc.id);
        return;
      }
      //   command.initialize(client.config.guild);
    });
*/
    client.user.setPresence({
      activities: [{ name: "AlpsBTE", type: "PLAYING" }],
      status: "online",
    });
  }
}

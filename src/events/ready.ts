import Event from "../classes/Event";
import Bot from "../classes/Bot";
import Command from "../classes/Command";

class ReadyEvent extends Event {
  constructor(client: Bot) {
    super("ready", client);
  }

  async run(client: Bot) {
    client.Logger.info(
      `Logged in at ${new Date().toLocaleString().replace(",", "")} as ${
        client.user?.tag
      } [${client.user?.id}]`,
      "CLIENT"
    );

    client.commands.forEach((command: Command) => {
      console.log(command.help.name);
    });

    client.user?.setPresence({
      activities: [{ name: "on alps-bte.com", type: "PLAYING" }],
      status: "online",
      afk: false,
    });
  }
}

export default ReadyEvent;

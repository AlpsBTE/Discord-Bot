import Bot from "../classes/Bot";
import Event from "../classes/Event";
import Command from "../classes/Command";
import fs from "fs/promises";

async function registerEvents(client: Bot, dir = ""): Promise<void> {
  const files = await fs.readdir(dir);
  for (const file of files) {
    const stat = await fs.lstat(`${dir}/${file}`);
    if (stat.isDirectory()) registerEvents(client, `${dir}/${file}`);
    if (file.endsWith(".js")) {
      const event = require(require.main?.path + `/${dir}/${file}`).default;
      if (event.prototype instanceof Event) {
        const evnt = new event(client);
        client.on(evnt.name, evnt.run.bind(evnt, client));
      }
    }
  }
}

async function registerCommands(client: Bot, dir = ""): Promise<void> {
  const files = await fs.readdir(dir);
  for (const file of files) {
    const stat = await fs.lstat(`${dir}/${file}`);
    if (stat.isDirectory()) registerCommands(client, `${dir}/${file}`);
    if (file.endsWith(".js")) {
      const command = require(require.main?.path + `/${dir}/${file}`).default;
      if (command.prototype instanceof Command) {
        const cmd = new command(client);
        client.commands.set(cmd.help.name, cmd);
      }
    }
  }
}

export default {
  registerCommands,
  registerEvents,
};

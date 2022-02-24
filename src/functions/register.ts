const { Collection } = require("mongoose"),
  path = require("path"),
  fs = require("fs").promises;

import Bot from "../classes/Bot";
import BaseEvent from "../classes/Event";
import BaseCommand from "../classes/Command";

/**
 * @param {Bot} client
 * @param {String} dir
 */
async function registerEvents(client: Bot, dir: string = "") {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory()) registerEvents(client, path.join(dir, file));
    if (file.endsWith(".js")) {
      const Event = require(path.join(filePath, file));
      if (Event.prototype instanceof BaseEvent) {
        const event = new Event();
        client.on(event.name, event.run.bind(event, client));
      }
    }
  }
}

/**
 * @param {Bot} client
 * @param {String} dir
 * @returns {Collection}
 */
async function registerCommands(client, dir = "") {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory()) registerCommands(client, path.join(dir, file));
    if (file.endsWith(".js")) {
      const Command = require(path.join(filePath, file));
      if (Command.prototype instanceof BaseCommand) {
        const cmd = new Command(client);
        if (!cmd.config)
          return client.Logger.error(`${cmd.help.name} has no config`);
        client.commands.set(cmd.help.name, cmd);
      }
    }
  }
}

module.exports = { registerCommands, registerEvents };

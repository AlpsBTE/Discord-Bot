import { Intents } from "discord.js";
import Bot from "./src/classes/Bot";
import mongoose from "mongoose";
import register from "./src/functions/register";

async function init() {
  const client = new Bot({
    partials: ["MESSAGE", "CHANNEL"],
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_PRESENCES,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_VOICE_STATES,
      Intents.FLAGS.DIRECT_MESSAGES,
    ],
  });

  const mongo = client.config.mongo;
  const connection = mongoose.connect(
    `mongodb://${mongo.user}:${encodeURIComponent(mongo.password)}@${
      mongo.host
    }/${mongo.database}?ssl=false`
  );
  client.connection = connection;

  await register.registerEvents(client, "./src/events");
  await register.registerCommands(client, "./src/commands");
  client.Logger.info(`Registered ${client.commands.size} commands`, "COMMANDS");

  await client.login(client.config.token);

  setTimeout(() => {
    const commandDeployer = require("./commandDeployer");
    //commandDeployer(client.commands, client.application.id)
  }, 5000);
}

init();

import Bot from "./src/classes/Bot";

(async () => {
  const { Intents } = require("discord.js");

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

  const mongoose = require("mongoose");

  const mongo = client.config.mongo;
  const connection = mongoose.connect(
    `mongodb://${mongo.user}:${encodeURIComponent(mongo.password)}@${
      mongo.host
    }/${mongo.database}?ssl=false`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  );

  const {
    registerEvents,
    registerCommands,
  } = require("./src/functions/register");
  await registerEvents(client, "../events");
  registerCommands(client, "../commands");
  client.Logger.info(`Registered ${client.commands.size} commands`, "COMMANDS");

  await client.login(client.config.token);
})();

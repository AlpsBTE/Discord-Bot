const Collection = require("@discordjs/collection");

module.exports = async function (commands, applicationId) {
  let commandsArray = [];
  commands.forEach((cmd) => {
    commandsArray.push(cmd.data);
  });

  const { REST } = require("@discordjs/rest");
  const { Routes } = require("discord-api-types/v9");
  const config = require("./config/config.js").default;

  const rest = new REST({ version: "9" }).setToken(config.token);

  console.log(commandsArray);

  (async () => {
    try {
      console.log("Started refreshing application (/) commands.");

      await rest.put(Routes.applicationGuildCommands(applicationId, config.guild), {
        body: commandsArray,
      });

      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error(error);
    }
  })();
};

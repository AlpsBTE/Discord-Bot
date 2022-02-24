import { Client, ClientOptions, Collection } from "discord.js";
import { Logger } from "./Logger";

class Bot extends Client {
  Logger: any;
  commands: Collection<unknown, unknown>;
  schemas: { suggestion: any };
  config: any;
  constructor(options: ClientOptions) {
    super(options);

    this.Logger = new Logger();

    this.commands = new Collection();

    this.schemas = {
      suggestion: require("../schemas/suggestion.ts"),
    };

    this.config = require("../../config/config.ts");
  }
}

export default Bot;

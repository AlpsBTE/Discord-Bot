import { Client, ClientOptions, Collection } from "discord.js";
import Logger from "./Logger";

export default class Bot extends Client {
  Logger: Logger;
  commands: Collection<unknown, unknown>;
  schemas: { suggestion: any };
  config: any;
  constructor(options: ClientOptions) {
    super(options);

    this.Logger = new Logger();

    this.commands = new Collection();

    this.schemas = {
      suggestion: require("../schemas/suggestion"),
    };

    this.config = require("../../config/config");
  }
}

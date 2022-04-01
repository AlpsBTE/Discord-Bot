import { Client, ClientOptions, Collection } from "discord.js";
import Command from "./Command";
import Logger from "../utils/Logger";
import { Model } from "mongoose";
import suggestion from "../schemas/suggestion";
import config from "../../config/config";

class Bot extends Client {
  Logger: Logger;
  commands: Collection<string, Command>;
  schemas: { suggestion: Model<any, any, any, any> };
  config: typeof config;
  connection: Promise<typeof import("mongoose")> | null;
  constructor(options: ClientOptions) {
    super(options);

    this.Logger = new Logger();

    this.commands = new Collection();

    this.schemas = {
      suggestion: suggestion,
    };

    this.config = config;

    this.connection = null;
  }
}

export default Bot;

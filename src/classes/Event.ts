import Bot from "../classes/Bot";
import { MessageEmbed, CommandInteraction, Message } from "discord.js";

export default class BaseEvent {
  name: string;
  constructor(name = "") {
    this.name = name;
  }

  async run(
    client: Bot,
    msg: any,
    interaction: CommandInteraction
  ) {}
}

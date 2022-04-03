import Bot from "./Bot";

export default class Event {
  name: string;
  client: Bot;
  constructor(name: string, client: Bot) {
    this.name = name;
    this.client = client;
  }

  async run(client: Bot, arg1: any, arg2: any, arg3: any): Promise<any> {
    client.Logger.warn("Base Event");
  }
}

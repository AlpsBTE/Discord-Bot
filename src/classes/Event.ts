export default class BaseEvent {
  name: string;
  constructor(name = "") {
    this.name = name;
  }

  async run() {}
}

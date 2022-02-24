import { Console } from "console";
import * as chalk from "chalk";

export default class Logger extends Console {
  
  constructor() {
    super(process.stdout, process.stderr);
  }

  /**
   * @param {String} input
   */
  info(input: string, type = "INFO") {
    const mess =
      chalk.bold.cyan(this.date() + " - [ " + type + " ] => ") + input;
    this.log(mess);
  }

  /**
   * @param {String} input
   */
  error(input: string) {
    const mess = chalk.bold.redBright(this.date() + " - [ ERROR ] => ") + input;
    super.error(mess);
  }

  /**
   * @param {String} input
   */
  warn(input: string) {
    const mess = chalk.bold.yellow(this.date() + " - [ WARN ] => ") + input;
    super.warn(mess);
  }

  date(msTimeStamp = new Date().getTime()) {
    let date = new Date(msTimeStamp);
    let minutes = date.getMinutes().toString();

    if (minutes.length === 1) minutes = `0${minutes}`;

    let seconds = date.getSeconds().toString();
    if (seconds.length === 1) seconds = `0${seconds}`;

    return `[ ${date.getFullYear()}.${
      date.getMonth() + 1
    }.${date.getDate()} - ${date.getHours()}:${minutes}:${seconds} ]`;
  }
}


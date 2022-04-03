import { Console } from "console";
import chalk from "chalk";

export default class Logger extends Console {
  constructor() {
    super(process.stdout, process.stderr);
  }

  /**
   * @param {String} input
   */
  info(input: string, type = "INFO"): void {
    if (type === "BLANK") {
      return this.log(chalk.hidden("-"));
    }
    const mess =
      chalk.bold.cyan(this.date() + " - [ " + type + " ] => ") + input;
    super.log(mess);
  }

  /**
   * @param {String} input
   */
  error(input: string): void {
    const mess = chalk.bold.redBright(this.date() + " - [ ERR- ] => ") + input;
    super.error(mess);
  }

  /**
   * @param {String} input
   */
  warn(input: string): void {
    const mess = chalk.bold.yellow(this.date() + " - [ WARN ] => ") + input;
    super.warn(mess);
  }

  date(msTimeStamp: number = new Date().getTime()): string {
    const date = new Date(msTimeStamp);

    let minutes = `${date.getMinutes()}`;
    if (minutes.length === 1) minutes = `0${minutes}`;

    let seconds = `${date.getSeconds()}`;
    if (seconds.length === 1) seconds = `0${seconds}`;

    return `[ ${date.getFullYear()}.${
      date.getMonth() + 1
    }.${date.getDate()} - ${date.getHours()}:${minutes}:${seconds} ]`;
  }
}

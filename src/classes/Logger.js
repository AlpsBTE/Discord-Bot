const { Console } = require("console");
const chalk = require("chalk");

class Logger extends Console {

    constructor() {
        super(process.stdout, process.stderr);
    };

    /**
     * @param {String} input
    */
    info(input, type = "INFO") {
        const mess = chalk.bold.cyan(this.date() + " - [ "+type+" ] => ") + input;
        this.log(mess);
    };

    /**
     * @param {String} input
    */
    error (input) {
        const mess = chalk.bold.redBright(this.date() + " - [ ERROR ] => ") + input;
        super.error(mess);
    };

    /**
     * @param {String} input
    */
    warn(input) {
        const mess = chalk.bold.yellow(this.date() + " - [ WARN ] => ") + input;
        super.warn(mess);
    };


    date(msTimeStamp = new Date().getTime()) {
        let date = new Date(msTimeStamp);

        var minutes = date.getMinutes();
        if(minutes.toString().length === 1) minutes = `0${minutes}`;

        var seconds = date.getSeconds();
        if(seconds.toString().length === 1) seconds = `0${seconds}`;

        return `[ ${date.getFullYear()}.${date.getMonth()+1}.${date.getDate()} - ${date.getHours()}:${minutes}:${seconds} ]`;
    };
};

module.exports = Logger;
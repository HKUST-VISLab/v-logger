import * as process from "process";
import LogLevel from "./log-level";

// export type LevelName = "VERBOSE" | "DEBUG" | "INFO" | "WARN" | "ERROR" | "CRITICAL" ;
export type FormatFn = (record: LogRecord) => string;

export class Logger {
    // private static logger: Logger;
    public name: string;
    private logLevel: LogLevel;
    private formatString: string;
    private formatFn: FormatFn;
    private stream: NodeJS.WritableStream = process.stdout;
    public constructor(name: string, logLevel = LogLevel.INFO) {
        /* tslint:disable:no-console */
        console.log(__filename);
        this.name = name;
        this.logLevel = logLevel;
    }
    public level(levelName?: string): void | LogLevel {
        if (levelName === undefined) {
            return this.logLevel;
        }
        this.logLevel = LogLevel.getLevelValue(levelName);
    }
    public verbose(msg: string): void {
        this.log("VERBOSE", msg);
    }
    public debug(msg: string): void {
        this.log("DEBUG", msg);
    }
    public info(msg: string): void {
        this.log("INFO", msg);
    }
    public warn(msg: string): void {
        this.log("WARN", msg);
    }
    public error(msg: string): void {
        this.log("ERROR", msg);
    }
    public critical(msg: string): void {
        this.log("CRITICAL", msg);
    }
    public log(level: string | LogLevel,
               msg: string | ((...args: any[]) => RecordInterface),
               stream: NodeJS.WritableStream = this.stream): void {
        const logLevel = LogLevel.getLevelValue(level);
        if (logLevel < this.logLevel) {
            return;
        }
        let record;
        if (typeof msg === "string") {
            record = {name: this.name, level: logLevel, msg} as LogRecord;
        } else {
            record = msg();
        }
        stream.write(this.formatFn(record) + "\n");
    }
    // public logRecord(record: LogRecord, stream = this.stream) {
    //     if (record.level < this.logLevel) {
    //         return;
    //     }
    //     stream.write(this.formatFn(record) + "\n");
    // }
    public format(formatter: string | FormatFn): void {
        if (typeof formatter === "string") {
            this.formatString = formatter;
            this.formatFn = compileFormat(formatter);
        } else {
            this.formatString = undefined;
            this.formatFn = formatter;
        }
    }
    public outStream(stream: NodeJS.WritableStream): void {
        this.stream = stream;
    }
}

// Standard necessary logging information
export interface RecordInterface {
    name: string;
    level: LogLevel;
    msg?: string;
    date?: Date;
}

export class LogRecord implements RecordInterface {
    private _date: Date;
    constructor(
        public name: string, public level: LogLevel = LogLevel.INFO,
        public msg: string = "") { }
    get date(): Date {  // lazy getter
        if (this._date === undefined) {
            this._date = new Date();
        }
        return this._date;
    }
}

export const DefaultFormats: {[name: string]: string} = {};

export function compileFormat(formatter: string): FormatFn {
    const fmt = formatter.replace(/"/g, '\\"');
    const tokens: string[] = [];
    const args: string[] = [];
    function tokensInit(match: string, name: string, arg: string | undefined): string {
        tokens.push(name);
        args.push(arg);
        return match;
    }
    const re = /:([\w][-\w]*)(?:\[([^\]]+)\])?/g;
    fmt.replace(re, tokensInit);
    function formatFn(record: LogRecord): string {
        function replacer(match: string, name: string, arg: string | undefined): string {
            if (arg === undefined) {
                return String(record[name]);
            } else {
                return String(record[name][arg]);
            }
        }
        const formattedString = fmt.replace(re, replacer);
        return formattedString;
    }
    return formatFn;
}

export const logger = new Logger(__filename);
// LogLevel.addLogLevel("add", 10);
// logger.level("NOTHING");
// logger

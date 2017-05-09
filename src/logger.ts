import * as process from "process";
import * as stream from "stream";
// import * as node from "NodeJS";
import LogLevel from "./log-level";

// export type LevelName = "VERBOSE" | "DEBUG" | "INFO" | "WARN" | "ERROR" | "CRITICAL" ;
export type FormatFn = (record: LogRecord) => string;

export class Logger {
    // private static logger: Logger;
    private logLevel: number;
    private formatString: string;
    private formatFn: FormatFn;
    private name: string;
    private stream: NodeJS.WritableStream = process.stdout;
    public constructor(name: string, logLevel = LogLevel.info) {
        /* tslint:disable:no-console */
        console.log(__filename);
        this.name = name;
        this.logLevel = logLevel;
    }
    public level(levelName: string): void {
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
    public log(level: string, msg: string): void {
        const logLevel = LogLevel.getLevelValue(level);
        if (logLevel < this.logLevel) {
            return;
        }
        const record = new LogRecord(this.name, logLevel, msg);
        this.stream.write(this.formatFn(record));
    }
    public format(formatter: string | FormatFn): void {
        if (typeof formatter === "string") {
            this.formatString = formatter;
            this.formatFn = compileFormat(formatter);
        } else {
            this.formatString = undefined;
            this.formatFn = formatter;
        }
    }
    public outStream(stream: stream.Writable): void {
        this.stream = stream;
    }

}

export class LogRecord {
    private name: string;
    private level: LogLevel;
    private msg: string;
    private date: Date;
    constructor(name: string, level: LogLevel, msg: string) {
        this.name = name;
        this.level = level;
        this.msg = msg;
        this.date = new Date();
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
LogLevel.addLogLevel("add", 10);
logger.level("NOTHING");
// logger

import * as process from "process";
import LogLevel from "./log-level";

// export type LevelName = "VERBOSE" | "DEBUG" | "INFO" | "WARN" | "ERROR" | "CRITICAL" ;
export type FormatFn = (record: any) => string;
export type DateFormatFn = (date: Date) => string;

// Standard necessary logging information
export interface RecordInterface {
    name: string;
    level: LogLevel;
    msg?: string;
    date?: Date;
}

export class LogRecord implements RecordInterface {
    // private _date: Date;
    constructor(
        public name: string, public level: LogLevel = LogLevel.INFO,
        public msg: string = "", private _date?: Date) { }
    get date(): Date {  // lazy getter
        if (this._date === undefined) {
            this._date = new Date();
        }
        return this._date;
    }
}

export interface LoggerOptions {
    logLevel?: LogLevel | string;
    format?: FormatFn | string;
    stream?: NodeJS.WritableStream;
    dateFormat?: DateFormatFn | string;
}

export class Logger {
    // private static logger: Logger;
    private logLevel: LogLevel = LogLevel.INFO;
    // private formatString: string;
    private formatFn: FormatFn = format("default");
    private stream: NodeJS.WritableStream = process.stdout;
    private dateFormatFn: DateFormatFn = dateFormat("iso");
    public constructor(public name: string = "", options: LoggerOptions = {}) {
        this.level(options.logLevel);
        this.format(options.format);
        this.outStream(options.stream);
        this.dateFormat(options.dateFormat);
    }
    public dateFormat(formatter?: string | DateFormatFn): void | DateFormatFn {
        if (formatter === undefined) {
            return this.dateFormatFn;
        }
        this.dateFormatFn = dateFormat(formatter);
        return;
    }
    public level(levelName?: string | LogLevel): void | LogLevel {
        if (levelName === undefined) {
            return this.logLevel;
        }
        this.logLevel = LogLevel.getLevel(levelName);
    }

    public format(formatter?: string | FormatFn): void | FormatFn {
        if (formatter === undefined) {
            return this.formatFn;
        }
        if (typeof formatter === "string") {
            this.formatFn = format(formatter);
        } else {
            this.formatFn = formatter;
        }
    }
    public outStream(stream?: NodeJS.WritableStream): void | NodeJS.WritableStream {
        if (stream === undefined) {
            return this.stream;
        }
        this.stream = stream;
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
        const logLevel = LogLevel.getLevel(level);
        if (logLevel < this.logLevel) {
            return;
        }
        let record;
        if (typeof msg === "string") {
            record = new LogRecord(this.name, logLevel, msg);
        } else {
            record = msg();
        }
        // a work around for date format
        record = new Proxy(record, { get: (target, property) => {
            if (property === "date") {
                return this.dateFormatFn(target[property]);
            }
            return target[property];
        }});
        record.dateFormatFn = this.dateFormatFn;
        stream.write(this.formatFn(record) + "\n");
    }
}

export function format(formatter: "default" | string) {
    if (formatter === "default") {
        return compileFormat(":date - :name > :level: :msg");
    }
    return compileFormat(formatter);
}

function compileFormat(formatter: string): FormatFn {
    const fmt = formatter.slice();
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

export function dateFormat(formatter: "utc" | "iso" | string | DateFormatFn): (date: Date) => string {
    if (formatter instanceof Function) {
        return formatter;
    }
    switch (formatter) {
        case "utc": return (date: Date) => date.toUTCString();
        case "iso": return (date: Date) => date.toISOString();
        default: return compileDateFormat(formatter);
    }
}

const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const abbrWeekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
const abbrMonths = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function padLeft(n: number | string, pad = "0", len = 2) {
    return (pad + n).slice(-len);
}

function compileDateFormat(formatter: string): DateFormatFn {
    const re = /\%([\w|\%])/g;
    return (date: Date): string => {
        const replacer = (match, arg) => {
            switch (arg) {
                case "%": return arg;  // A literal '%' character.
                case "a": return abbrWeekDays[date.getDay()];  // Locale’s abbreviated weekday name.
                case "A": return weekDays[date.getDay()];  // Locale’s full weekday name.
                case "b": return abbrMonths[date.getDay()];  // Locale’s abbreviated month name.
                case "B": return months[date.getDay()];  // Locale’s full month name.
                case "c": return date.toDateString();  // Locale’s appropriate date and time representation.
                // Day of the month as a decimal number [01,31].
                case "d": return padLeft(date.getDate());
                // Hour (24-hour clock) as a decimal number [00,23].
                case "H": return padLeft(date.getHours());
                // Hour (12-hour clock) as a decimal number [01,12].
                case "I": const i = date.getHours() % 12;
                          return padLeft(i === 0 ? 12 : i);
                // case "j": throw Error("currently do not support token \"j\"");
                case "m": return padLeft(date.getMonth() + 1);  // Month as a decimal number [01,12].
                case "M": return padLeft(date.getMinutes());  // Minute as a decimal number [00,59].
                case "P": return date.getHours() < 12 ? "AM" : "PM";  // Locale’s equivalent of either AM or PM.
                case "S": return padLeft(date.getSeconds());  // Second as a decimal number [00,59].
                // case "U": return Error("currently do not support token \"j\"");
                case "w": return date.getDay().toString();  // Weekday as a decimal number [0(Sunday),6].
                // case "W": return String(date.getDate());
                case "x": return date.toLocaleDateString();  // Locale’s appropriate date representation.
                case "X": return date.toLocaleTimeString();  // Locale’s appropriate time representation.
                // Year without century as a decimal number [00,99].
                case "y": return date.getFullYear().toString().slice(2, 4);
                case "Y": return date.getFullYear().toString();  // Year with century as a decimal number.
                // Time zone offset indicating time difference from UTC/GMT of the form +HHMM or -HHMM,
                // where H represents decimal hour digits and M represents decimal minute digits [-23:59, +23:59].
                case "z": const offset = date.getTimezoneOffset();
                          const s = padLeft(Math.abs(Math.ceil(offset / 60))) + padLeft(offset % 60);
                          return offset < 0 ? ("-" + s) : ("+" + s);
                case "Z": return "";
                default:
                    throw Error(`currently do not support token ${arg}`);
            }
        };
        return formatter.replace(re, replacer);
    };
}

export const logger = new Logger(__filename);
// LogLevel.addLogLevel("add", 10);
// logger.level("NOTHING");
// logger

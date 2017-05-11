// A Koa logger middleware that logs http request and response

import * as Koa from "koa";
import LogLevel from "./log-level";
import { format, FormatFn, Logger, LoggerOptions, LogRecord, RecordInterface } from "./logger";
import { readonlyProxy } from "./utils";
// const logger = new Logger("KoaLogger");

export type DefaultFormat = "combined" | "common" | "short" | "tiny";
export type FormatType = DefaultFormat | string | FormatFn;

/* tslint:disable max-line-length */
const defaultFormats: {[name: string]: string} = {
    combined: `:remote-addr [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"`,
    common: `:remote-addr [:date] ":method :url HTTP/:http-version" :status :length - :response-time ms`,
    short: `:remote-addr :method :url HTTP/:http-version :status :length - :response-time ms`,
    tiny: `:method :url :status :res[content-length] - :response-time ms`,
};

function getFormatter(formatter: FormatType) {
    if (formatter instanceof Function) {
        return formatter;
    } else if (formatter in defaultFormats) {
        return format(defaultFormats[formatter]);
    }
    return format(formatter);
}

export interface KoaLoggerOptions extends LoggerOptions {
    mapFn?: (ctx: Koa.Context) => LogLevel;
}

// export interface KoaLogger extends KoaLoggerOptions {
//     (name: string, options?: KoaLoggerOptions): Koa.Middleware;
// }
export type KoaLogger = (name: string, options?: KoaLoggerOptions) => Koa.Middleware;

/**
 * loggerCreator
 */
const koaLogger: any = (name = "KoaLogger", options: KoaLoggerOptions = {}) => {
    // parse options
    const mapFn = options.mapFn !== undefined ? options.mapFn : (ctx: Koa.Context) => {
        if (ctx.res.statusCode < 400) {
            return LogLevel.INFO;
        } else {
            return LogLevel.WARN;
        }
    };
    // const logLevel = options.logLevel !== undefined ? options.logLevel : LogLevel.INFO;
    // const stream = options.stream !== undefined ? options.stream : process.stdout;
    options.format = getFormatter(options.format !== undefined ? options.format : "common");
    // create logger
    const logger = new Logger(name, options);
    // logger.outStream(stream);
    // logger.format(getFormatter(format));
    return async (ctx, next) => {
        await next();
        const recordLevel = mapFn(ctx);
        logger.log(recordLevel, () => {
            return CreateKoaRecord(logger.name, recordLevel, ctx);
        });
    };
};

/* tslint:disable no-console */
export default koaLogger as KoaLogger;

// function delegate(proxied: string, name: string) {
//     return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
//         /* tslint:disable forin */
//         return target[proxied][name];
//     };
// }

/**
 * A KoaLogRecord extends readonly Koa.Context and LogRecord.
 * Properties of Context will have overload those with same name in LogRecord.
 * @export
 * @interface KoaLogRecord
 * @extends {LogRecord}
 * @extends {Readonly<Koa.Context>}
 */
// export interface ContextRecord<Context> extends LogRecord, Readonly<Context> { }
export type ContextRecord<Context> = Readonly<Context> & RecordInterface;

class KoaLogRecord extends LogRecord {
    public startDate: Date;
    constructor(name: string, level: LogLevel, public ctx: Koa.Context) {
        super(name, level);
        this.startDate = new Date();
    }
    get ["response-time"](): number {
        return Date.now() - this.startDate.getTime();
    }
    get ["remote-addr"](): string {
        return (this.ctx.req.connection && this.ctx.req.connection.remoteAddress) || undefined;
    }
    get ["http-version"](): string {
        return this.ctx.req.httpVersion;
    }
    // get res() {}
    // @delegate("ctx", "res") get res() { return this.ctx.res; }
}

// export type KoaLogRecord = ContextRecord<Koa.Context>;

function CreateKoaRecord(name: string, level: LogLevel, ctx: Koa.Context): ContextRecord<Koa.Context> {
    const koaRecord = new KoaLogRecord(name, level, ctx);
    const proxy = new Proxy(koaRecord, readonlyProxy("ctx"));
    return proxy as ContextRecord<Koa.Context>;
}

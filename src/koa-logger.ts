// A Koa logger middleware that logs http request and response

import * as Koa from "koa";
import LogLevel from "./log-level";
import { compileFormat, FormatFn, Logger, LogRecord, RecordInterface } from "./logger";
import { readonlyProxy } from "./utils";
// const logger = new Logger("KoaLogger");

export type DefaultFormat = "combined" | "common" | "short" | "tiny";
export type FormatType = DefaultFormat | string | FormatFn;

/* tslint:disable max-line-length */
const defaultFormats: {[name: string]: string} = {
    combined: `:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"`,
    common: `:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]`,
    short: `:remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms`,
    tiny: `:method :url :status :res[content-length] - :response-time ms`,
};

function getFormatter(format: FormatType) {
    if (format instanceof Function) {
        return format;
    } else if (format in defaultFormats) {
        return compileFormat(defaultFormats[format]);
    }
    return compileFormat(format);
}

export interface LogOptions {
    logLevel?: LogLevel;  // the threshold level of logging
    mapFn?: (ctx: Koa.Context) => LogLevel;
    stream?: NodeJS.WritableStream;
}

export interface KoaLogger extends LogOptions {
    (name: string, format?: FormatType, options?: LogOptions): Koa.Middleware;
    name: string;
}

/**
 * loggerCreatpr
 */
const koaLogger: any = (name = "KoaLogger", format?: FormatType, options?: LogOptions) => {
    const mapFn = options.mapFn !== undefined ? options.mapFn : (ctx: Koa.Context) => {
        if (ctx.res.statusCode < 400) {
            return LogLevel.INFO;
        } else {
            return LogLevel.WARN;
        }
    };
    const logLevel = options.logLevel !== undefined ? options.logLevel : LogLevel.INFO;
    const stream = options.stream !== undefined ? options.stream : process.stdout;
    const logger = new Logger(name, logLevel);
    logger.outStream(stream);
    logger.format(getFormatter(format));
    return async (ctx, next) => {
        await next();
        const recordLevel = mapFn(ctx);
        logger.log(recordLevel, () => {
            return CreateKoaRecord(logger.name, recordLevel, ctx);
        });
    };
};

export { koaLogger  as KoaLogger };

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
        this.startDate = this.date;
    }
    get ["response-time"](): number {
        return Date.now() - this.startDate.getTime();
    }
    get ["remote-addr"](): string {
        return (this.ctx.req.connection && this.ctx.req.connection.remoteAddress) || undefined;
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

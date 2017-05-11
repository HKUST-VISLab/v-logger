import test from "ava";

import { Logger, LogLevel, LogRecord } from "./index";
import { BufferStream } from "./testUtils";

test("test", async (t) => {
    // t.plan(1);
    const logger = new Logger("TEST", { logLevel: LogLevel.INFO});
    const stream = new BufferStream();
    logger.outStream(stream);
    logger.format("[:name] :level: :msg");
    logger.verbose("verbose");
    logger.debug("debug");
    logger.info("info");
    logger.warn("warn");
    logger.error("error");
    logger.critical("critical");
    /* tslint:disable no-console */
    return t.is(stream.buffer,
                "[TEST] INFO: info\n[TEST] WARN: warn\n[TEST] ERROR: error\n[TEST] CRITICAL: critical\n");
});

test("test date", async (t) => {
    const stream = new BufferStream();
    const logger = new Logger("TEST", {logLevel: LogLevel.INFO, stream});
    logger.dateFormat("iso");
    logger.format("[:date] :name > :level: :msg");
    logger.log("WARN", () => {
        return new LogRecord(logger.name, LogLevel.WARN, "warn", new Date("10/21/2017 GMT"));
    });
    logger.dateFormat("utc");
    logger.log("ERROR", () => {
        return new LogRecord(logger.name, LogLevel.ERROR, "error", new Date("10/21/2017 GMT"));
    });
    return t.is(stream.buffer,
                "[2017-10-21T00:00:00.000Z] TEST > WARN: warn\n[Sat, 21 Oct 2017 00:00:00 GMT] TEST > ERROR: error\n");
});

test("test date formatter", async (t) => {
    const stream = new BufferStream();
    const logger = new Logger("TEST", {logLevel: LogLevel.INFO, stream});
    logger.dateFormat("%a %A %b %B %d %I %m %P %w %y %Y %H:%M:%S %% %Z |%c|%x|%X|%z");
    logger.format("[:date]");
    logger.log("ERROR", () => {
        return new LogRecord(logger.name, LogLevel.ERROR, "error", new Date("Sat, 06 May 2017 19:40:00"));
    });
    const offset = new Date().getTimezoneOffset();
    let z = offset < 0 ? "-" : "+";
    z += ("0" + Math.abs(Math.floor(offset / 60))).slice(-2);
    z += ("0" + offset % 60).slice(-2);
    return t.is(stream.buffer,
                "[Sat Saturday May May 06 07 05 PM 6 17 2017 19:40:00 %  " +
                "|Sat May 06 2017|5/6/2017|7:40:00 PM|" + z + "]\n");
});

test("test date error format", async (t) => {
    const stream = new BufferStream();
    const logger = new Logger("TEST", {logLevel: LogLevel.INFO, stream});
    const error = t.throws(() => {
        logger.dateFormat("%u");
    }, Error);
    return t.is(error.message, "Currently do not support token \"u\"!");
});

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
    // t.plan(1);
    const logger = new Logger("TEST", {logLevel: LogLevel.INFO});
    logger.dateFormat("iso");
    const stream = new BufferStream();

    logger.outStream(stream);
    logger.format("[:date] :name > :level: :msg");
    logger.log("WARN", () => {
        return new LogRecord(logger.name, LogLevel.WARN, "warn", new Date("10/21/2017"));
    });
    logger.dateFormat("%a, %d %b %Y %H:%M:%S");
    logger.log("ERROR", () => {
        return new LogRecord(logger.name, LogLevel.ERROR, "error", new Date("11 May 2017 11:00:00"));
    });
    /* tslint:disable no-console */
    return t.is(stream.buffer,
                "[2017-10-20T16:00:00.000Z] TEST > WARN: warn\n[Thu, 11 May 2017 11:00:00] TEST > ERROR: error\n");
});

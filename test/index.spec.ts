import test from "ava";

import { Logger, LogLevel } from "./index";
import { BufferStream } from "./testUtils";

test("test", async (t) => {
    // t.plan(1);
    const logger = new Logger("TEST", LogLevel.INFO);

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

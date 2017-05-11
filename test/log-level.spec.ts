import test from "ava";

import { LogLevel } from "./index";

test("error add level", async (t) => {
    const error = t.throws(() => {
        LogLevel.addLevel("ERROR", 10);
    }, Error);
    t.is(error.message, 'LogLevel already has name "ERROR"!');
});

test("add level", async (t) => {
    LogLevel.addLevel("HA", 22);
    const level = LogLevel.getLevel("HA");
    t.is(Number(level), 22);
    t.is(Number(LogLevel.getLevel(level)), 22);
});

test("error get level", async (t) => {
    const error = t.throws(() => {
        LogLevel.getLevel("HAHA");
    }, Error);
    t.is(error.message, 'No level named "HAHA"!');
});

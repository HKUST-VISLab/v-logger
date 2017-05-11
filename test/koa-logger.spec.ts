import test from "ava";
import * as Koa from "koa";
// import * as nock from "nock";
import * as request from "supertest";

import koaLogger from "./koa-logger";
import { BufferStream } from "./testUtils";

test("test koa logger normal", async (t) => {
    const app = new Koa();
    const stream = new BufferStream();
    app.use(koaLogger("Koa", {format: "common", stream}));
    app.use(async (ctx, next) => {
        await next();
        ctx.body = "Hello World";
        ctx.res.statusCode = 200;
    });
    const req = request(app.listen());
    await req.get("/").expect(200);
    t.regex(stream.buffer, new RegExp(
            ["\\:\\:ffff\\:127\\.0\\.0\\.1 \\[[\\d]{4}-[\\d]{2}-[\\d]{2}T[\\d]{2}",
            '\\:[\\d]{2}\\:[\\d]{2}\\.[\\d]{3}Z\\] \\"GET \\/ HTTP\\/1\\.1\\" 200 11 - [\\d]* ms'].join("")));
});

test("test koa logger error", async (t) => {
    const app = new Koa();
    const stream = new BufferStream();
    app.use(koaLogger("Koa", {format: ":method :url :status :response[length]", stream}));
    app.use(async (ctx, next) => {
        await next();
        ctx.body = "Hello World";
        ctx.res.statusCode = 400;
    });
    const req = request(app.listen());
    const res = await req.get("/test").expect(400);
    /* tslint:disable no-console */
    console.log(res);
    t.regex(stream.buffer, /GET \/test 400 11/);
});

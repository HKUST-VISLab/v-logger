import test from "ava";
import * as Koa from "koa";
// import * as nock from "nock";
import * as request from "supertest";

import koaLogger from "./koa-logger";
import { BufferStream } from "./testUtils";

test("test koa logger", async (t) => {
    const app = new Koa();
    const stream = new BufferStream();
    app.use(koaLogger("Koa", {format: "common", stream}));
    app.use(async (ctx, next) => {
        await next();
        ctx.body = "Hello World";
        ctx.res.statusCode = 200;
    });
    const req = request(app.listen(3000));
    await req.get("/").expect(200);
    // app.listen(3000);
    // nock("localhost:3000")
    //     .get("/")
    //     .reply("Hello World");
    /* tslint:disable no-console */
    // console.log(res);
    t.regex(stream.buffer, new RegExp(
            ["\\:\\:ffff\\:127\\.0\\.0\\.1 \\[[\\d]{4}-[\\d]{2}-[\\d]{2}T[\\d]{2}",
            '\\:[\\d]{2}\\:[\\d]{2}\\.[\\d]{3}Z\\] \\"GET \\/ HTTP\\/1\\.1\\" 200 11 - [\\d]* ms'].join("")));
});

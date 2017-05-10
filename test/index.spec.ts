import test from "ava";
import { Logger, LogLevel } from "./index";
// import * as Koa from "koa";
// import * as request from "supertest";

// function makeApp() {
//     const app: Koa = new Koa();
//     app.use(async (ctx, next) => {
//         try {
//             await next();
//         } catch (err) {
//             // will only respond with JSON
//             ctx.status = err.statusCode || err.status || 500;
//             ctx.response.status = ctx.status;
//             ctx.body = {
//                 message: err.message,
//             };
//         }
//     });
//     return app;
// }

// function

test("test", async (t) => {
    // const app = makeApp();
    const logger = new Logger("TEST", LogLevel.INFO);
    logger.outStream(process.stdout);
    logger.format("[:name] :level: :msg");
    logger.verbose("hi, this is verbose");
    logger.debug("debug messsge.");
    t.pass();
});

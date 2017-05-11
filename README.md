# v-logger

[![Build Status](https://travis-ci.org/myaooo/v-logger.svg?branch=master)](https://travis-ci.org/myaooo/v-logger.svg?branch=master)
[![codecov](https://codecov.io/gh/myaooo/v-logger/branch/master/graph/badge.svg)](https://codecov.io/gh/myaooo/v-logger)
[![Greenkeeper badge](https://badges.greenkeeper.io/HKUST-VISLab/koa-bodyparser-ts.svg)](https://greenkeeper.io/)

A logger middleware for koa written in Typescript

## Basic Usage

```javascript
const { logger } = require("v-logger");

logger.info("Hello world");
```

Customizing logging format and logging level:

```javascript
logger.format("[:date] :name > :level: :msg");
logger.level("DEBUG");
logger.info("Another hi!");
```

or create your own logger with options:

```javascript
const { Logger } = require("v-logger");
const myLogger = new Logger("MyLogger", { 
    format: "[:date] :name > :level: :msg",
    dateFormat: "iso",
    logLevel: "WARN",
});
myLogger.info("This message will not be logged.");
```

## Koa Logger Middleware

Create a koa logger middleware by:

```typescript
import { koaLogger } from "v-logger";
import * as Koa from "koa";

const app = new Koa();
app.use(koaLogger("MyLogger"));
...
```

### Customizing Logger Middleware

```typescript
const options = {
    format: ':remote-addr [:date] ":method :url HTTP/:http-version" :status :length - :response-time ms',
    logLevel: "INFO",
    dateFormat: "utc",
};
app.use(koaLogger("MyLogger", options));

```

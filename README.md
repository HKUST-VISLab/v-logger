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

or create your own logger with options and write logs to file:

```javascript
const fs = require("fs");

const { Logger } = require("v-logger");
const myLogger = new Logger("MyLogger", { 
    format: "[:date] :name > :level: :msg",
    dateFormat: "iso",
    logLevel: "WARN",
    stream: fs.createWriteStream("warnings.log");
});
myLogger.info("This message will not be logged.");
myLogger.warn("This message will be logged.");
```

## Log Levels

There are 6 pre-defined `LogLevel`s, each associate with an integer value:

```typescript
VERBOSE: 0;
DEBUG: 10;
INFO: 20;
WARN: 30;
ERROR: 40;
CRITICAL: 50;
```

You can customize your own LogLevel using:

```typescript
LogLevel.addLevel("MY-LEVEL", 25);
logger.log("MY-LEVEL", "This is a log with custom log level.");
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

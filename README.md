# v-logger

[![Build Status](https:
ravis-ci.org/myaooo/v-logger.svg?branch=master)](https:
ravis-ci.org/myaooo/v-logger.svg?branch=master)
[![codecov](https:
odecov.io/gh/myaooo/v-logger/branch/master/graph/badge.svg)](https:
odecov.io/gh/myaooo/v-logger)
[![Greenkeeper badge](https:
adges.greenkeeper.io/HKUST-VISLab/koa-bodyparser-ts.svg)](https:
reenkeeper.io/)

A customizable logger module written in Typescript. Extension of the logger is available as a koa logger middleware.

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

## Options

Available options for customizing a logger instance:

* logLevel: the threshold LogLevel of the logger, all logs with lower level than this one would be emitted.
    Default to `"INFO"`.

* format: a format template for logging, all tokens should start with a `:`.
    
    Available tokens for the basic logger are: `date` (the created date of a log record), 
    `name` (the name of the logger), `level` (the level of a log record), `msg` (the message or content of the log).

* stream: a `WritableStream` to write the log to. Default to `process.stdout`.

* dateFormat: a format template for date. Pre-set formats are `"iso"` and `"utc"`. 
    To customize your own date format, please reference the following available tokens.

`%%`: A literal `%` character.

`%a`: Locale’s abbreviated weekday name.

`%A`: Locale’s full weekday name.

`%b`: Locale’s abbreviated month name.

`%B`: Locale’s full month name.

`%c`: Locale’s appropriate date and time representation.

`%d`: Day of the month as a decimal number [01,31].

`%H`: Hour (24-hour clock) as a decimal number [00,23].

`%I`: Hour (12-hour clock) as a decimal number [01,12].

`%m`: Month as a decimal number [01,12].

`%M`: Minute as a decimal number [00,59].

`%P`: Locale’s equivalent of either AM or PM.

`%S`: Second as a decimal number [00,59].

`%w`: Weekday as a decimal number [0(Sunday),6].

`%x`: Locale’s appropriate date representation.

`%X`: Locale’s appropriate time representation.

`%y`: Year without century as a decimal number [00,99].

`%Y`: Year with century as a decimal number.

`%z`: Time zone offset indicating time difference from UTC/GMT of the form +HHMM or -HHMM,
where H represents decimal hour digits and M represents decimal minute digits [-23:59, +23:59].

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

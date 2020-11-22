require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");
module.exports = function () {
  const myCustomLevels = {
    levels: {
      foo: 0,
      bar: 1,
      baz: 2,
      foobar: 3,
    },
    colors: {
      foo: "blue",
      bar: "green",
      baz: "yellow",
      foobar: "red",
    },
  };
  const logger = winston.createLogger({
    level: "info",
    levels: myCustomLevels,
    format: winston.format.json(),
    defaultMeta: { service: "user-service" },
    transports: [
      //
      // - Write to all logs with level `info` and below to `combined.log`
      // - Write all logs error (and below) to `error.log`.
      //
      new winston.transports.File({ filename: "error.log", level: "error" }),
      new winston.transports.File({ filename: "combined.log" }),
    ],
  });

  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );

  winston.add(
    new winston.transports.MongoDB({
      db: "mongodb://localhost/Vidly-service",
      level: "info",
    })
  );

  winston.exceptions.handle(
    // new winston.transports.Console({
    //   format: winston.format.combine(
    //     winston.format.colorize(),
    //     winston.format.json(),
    //     winston.format.prettyPrint
    //   )
    // }),
    new winston.transports.File({
      filename: "uncaughtExceptions.log",
    })
  );
  winston.addColors(myCustomLevels.colors);

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  return logger;
};

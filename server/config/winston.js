const winston = require("winston");
const appRoot = require("app-root-path");

const options = {
  appConf: {
    level: "info",
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880,
    maxFiles: 5,
    colorize: false,
  },
  errorConf: {
    level: "error",
    filename: `${appRoot}/logs/error.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  },
  debug: {
    level: "debug",
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const logger = new winston.createLogger({
  transports: [
    new winston.transports.File(options.appConf),
    new winston.transports.File(options.errorConf),
    new winston.transports.Console(options.debug),
  ],
  exitOnError: false,
});

logger.stream = {
  write: (message, encoding) => {
    logger.info(message);
  },
};

module.exports = logger;

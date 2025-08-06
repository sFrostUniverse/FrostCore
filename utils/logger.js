const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'debug', // set minimum log level here
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
  ),
  transports: [
    new transports.Console(),
    // optionally add file transport:
    // new transports.File({ filename: 'logs/frostcore.log' }),
  ],
});

module.exports = logger;

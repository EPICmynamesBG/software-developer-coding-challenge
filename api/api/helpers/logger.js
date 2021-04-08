const { Logger, transports } = require('winston');
const fs = require('fs');
const { NODE_ENV } = require('../../config/config');

if (!fs.existsSync('./logs')) {
  fs.mkdirSync('./logs');
}

const logger = new Logger({
  transports: [
    new transports.File({
      level: 'silly',
      filename: './logs/all.log',
      handleExceptions: NODE_ENV !== 'test',
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
      timestamp: true
    }),
    new transports.Console({
      level: 'silly',
      handleExceptions: NODE_ENV !== 'test',
      json: false,
      colorize: true,
      timestamp: true
    })
  ],
  exitOnError: NODE_ENV === 'test'
});

module.exports = logger;

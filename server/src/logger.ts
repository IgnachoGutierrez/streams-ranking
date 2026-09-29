import path from 'node:path';
import {pino} from 'pino';
import config from './config/config.js';

const options: pino.LoggerOptions = {
    timestamp: pino.stdTimeFunctions.isoTime,
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'trace'
}

// Configurable log file path, e.g. LOG_FILE=/var/log/streams-ranking/api.log
const logFile = path.resolve(config.logFile || './logs/api.log');

const loggingTransports = [];

loggingTransports.push({
    target: 'pino/file',
    options: { destination: logFile, mkdir: true }
})

if (process.env.NODE_ENV !== 'production') {
    loggingTransports.push({
      target: "pino-pretty",
      level: 'trace',
      options: {
        colorize: true,
      },
    });
}

const targets = pino.transport({ targets: loggingTransports });

const logger = pino(options, targets);

export default logger;
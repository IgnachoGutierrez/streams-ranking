import {pino} from 'pino';

const options: pino.LoggerOptions = {
    timestamp: pino.stdTimeFunctions.isoTime,
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'trace'
}

const loggingTransports = [];

loggingTransports.push({
    target: 'pino/file',
    options: { destination: './logs/api.log', mkdir: true }
})

if (process.env.NODE_ENV !== 'production') {
    loggingTransports.push({
      target: "pino-pretty",
      options: {
        colorize: true,
      },
    });
}

const targets = pino.transport({ targets: loggingTransports });

const logger = pino(options, targets);

export default logger;
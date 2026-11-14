import app from './app.js';
import logger from './logger.js';

const port = 3000;

async function start() {
    const exitHandler = () => {
        logger.info('Server closed');
        process.exit(1);
      };
    
      const unexpectedErrorHandler = (error: unknown) => {
        logger.fatal(error);
        exitHandler();
      };
    
      process.on('uncaughtException', unexpectedErrorHandler);
      process.on('unhandledRejection', unexpectedErrorHandler);
    
    const server = app.listen(port, () => {
      logger.info(`Example app listening on port ${port}`);
    });

    // Sent by `docker stop` (SIGTERM) and Ctrl+C (SIGINT): finish in-flight
    // requests, then exit, so the container stops without waiting to be killed.
    const shutdown = (signal: string) => {
      logger.info(`${signal} received`);
      server.close(() => process.exit(0));
      server.closeIdleConnections();
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
}

start();
import app from './app';
import logger from './logger';

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
    
      process.on('SIGTERM', () => {
        logger.info('SIGTERM received');
      });
    
    app.listen(port, () => {
      logger.info(`Example app listening on port ${port}`)
    });
}

start();
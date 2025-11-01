require('module-alias/register');
require('reflect-metadata'); // use for babel lib

const { env } = require('./config');
const { bootstrapFastify } = require('./app');

const infra = require('@/infra');

let fastify;

const startServer = async () => {
  try {
    await infra.bootstrapInfra();

    fastify = await bootstrapFastify();

    await fastify.listen({
      port: env.PORT,
      host: env.HOST,
    });

    console.log('Server starting.');
  } catch (err) {
    if (fastify && fastify.log) {
      fastify.log.error(err);
    } else {
      console.error('Error stating server:', err);
    }

    await infra.shutdownInfra();

    process.exit(1);
  }
};

const shutdown = async (signal) => {
  console.log(`Received ${signal}. Shutting down server...`);

  let shutdownFailed = false;
  try {
    if (fastify) {
      try {
        await fastify.close();

        console.log('Server closed gracefully.');
      } catch (err) {
        console.error('Error during server shutdown:', err);
        shutdownFailed = true;
      }
    }

    await infra.shutdownInfra();
  } catch (err) {
    console.error('Error during infrastructure shutdown:', err);
    shutdownFailed = true;
  } finally {
    if (shutdownFailed) {
      process.exit(1);
    } else {
      console.log('Shutdown complete. Exiting process.');
      process.exit(0);
    }
  }
};

// Action handlers for graceful shutdown
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  shutdown('unhandledRejection');
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
  shutdown('uncaughtException');
});

startServer();

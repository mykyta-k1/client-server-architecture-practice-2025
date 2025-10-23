require('module-alias/register');

const { env } = require('./config');
const { bootstrapFastify } = require('./app');

let fastify;

const startServer = async () => {
  try {
    fastify = bootstrapFastify();

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

    process.exit(1);
  }
};

const shutdown = async (signal) => {
  console.log(`Received ${signal}. Shutting down server...`);
  if (fastify) {
    try {
      await fastify.close();
      console.log('Server closed gracefully.');
      process.exit(0);
    } catch (err) {
      console.error('Error during server shutdown:', err);
      process.exit(1);
    }
  } else {
    process.exit(0);
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

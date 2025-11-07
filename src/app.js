const Fastify = require('fastify');
const swagger = require('@fastify/swagger');

const { env } = require('./config');
const { logger } = require('./logger');

const { openApiConfig, registerSchemas } = require('@/docs/openapi');

const bootstrapFastify = async () => {
  // Create Fastify instance
  const fastify = Fastify({
    loggerInstance: logger,
    exposeHeadRoutes: false,
    connectionTimeout: 20_000,
    disableRequestLogging: true,
    routerOptions: {
      ignoreTrailingSlash: true,
    },
  });

  await fastify.register(swagger, {
    openapi: openApiConfig,
  });

  registerSchemas(fastify);

  // 💥 Race condition, Use Lazy init for routes
  require('@/routes').patchRouting(fastify);

  if (env.IS_DEV_ENV) {
    const requestLogger = require('@mgcrea/fastify-request-logger').default;

    fastify.register(requestLogger);

    fastify.ready(() => {
      console.log(`\nAPI Structure\n${fastify.printRoutes()}`);
    });
  }

  return fastify;
};

module.exports = { bootstrapFastify };

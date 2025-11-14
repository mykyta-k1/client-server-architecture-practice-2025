const Fastify = require('fastify');
const swagger = require('@fastify/swagger');

const { env, session } = require('./config');
const { logger } = require('./logger');

const { patchErrorHandling } = require('@/handlers/errors');
const { openApiConfig, registerSchemas } = require('@/docs/openapi');

/**
 * Initializes and configures the Fastify instance
 * @returns {Promise<import("fastify").FastifyInstance>} Configured Fastify instance
 */
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

  await fastify.register(require('@fastify/request-context'), {
    hook: 'preValidation',
    defaultStoreValues: {
      authData: null,
    },
  });

  await fastify.register(require('@fastify/cookie'), {
    secret: env.COOKIE_SECRET, // ? for cookies signature
    parseOptions: {
      secure: true,
      httpOnly: true,
      priority: 'high',
      sameSite: session.SAME_SITE,
    },
  });

  await fastify.register(require('@fastify/auth'), { defaultRelation: 'and' });

  await fastify.register(swagger, {
    openapi: openApiConfig,
  });

  patchErrorHandling(fastify);

  registerSchemas(fastify);

  // 💥 Race condition, Use Lazy init for routes
  require('@/routes').patchRouting(fastify);
  require('@/handlers/auth').patchAuth(fastify);

  if (env.IS_DEV_ENV) {
    const requestLogger = require('@mgcrea/fastify-request-logger').default;

    fastify.register(requestLogger);

    fastify.ready(() => {
      console.log(`\nAPI Structure\n${fastify.printRoutes()}`);
    });
  }

  await fastify.ready();

  return fastify;
};

module.exports = { bootstrapFastify };

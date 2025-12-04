const { authRouter } = require('./auth');
const { citiesRouter } = require('./city');
const { forecastRouter } = require('./forecast');
const { healthCheck } = require('./healthCheck');

module.exports.patchRouting = (fastify) => {
  fastify.register(authRouter);
  fastify.register(citiesRouter);
  fastify.register(forecastRouter);
  fastify.register(healthCheck);

  // fastify.setNotFoundHandler((request, reply) => {
  //   reply.status(404).send({ error: 'Not Found' });
  // });

  // fastify.setErrorHandler((error, request, reply) => {
  //   fastify.log.error(error);
  //   reply.status(500).send({ error: 'Internal Server Error' });
  // });

  fastify.get('/openapi.json', async (request, reply) => {
    return fastify.swagger();
  });
};

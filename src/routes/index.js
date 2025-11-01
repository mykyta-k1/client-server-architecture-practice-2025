const { citiesRouter } = require('./city');
const { forecastRouter } = require('./forecast');

module.exports.patchRouting = (fastify) => {
  fastify.register(citiesRouter);
  fastify.register(forecastRouter);

  fastify.setNotFoundHandler((request, reply) => {
    reply.status(404).send({ error: 'Not Found' });
  });

  fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error);
    reply.status(500).send({ error: 'Internal Server Error' });
  });
};

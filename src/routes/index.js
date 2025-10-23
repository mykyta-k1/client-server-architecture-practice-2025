const { echoRoute } = require('./echo');
const { resourcesRouter } = require('./resources');

module.exports.patchRouting = (fastify) => {
  fastify.register(echoRoute);
  fastify.register(resourcesRouter);

  fastify.setNotFoundHandler((request, reply) => {
    reply.status(404).send({ error: 'Not Found' });
  });

  fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error);
    reply.status(500).send({ error: 'Internal Server Error' });
  });
};

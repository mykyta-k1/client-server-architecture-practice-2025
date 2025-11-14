const { createCity } = require('@/useCases/cityCRUD');
const { logger } = require('@/logger');

module.exports.createCity = (fastify) => ({
  url: '/cities',
  method: 'POST',
  bodyLimit: 1024,
  schema: {
    body: { $ref: 'City#' },
    response: {
      201: { $ref: 'City#' },
      500: { type: 'object', properties: { error: { type: 'string' } } },
    },
  },
  preValidation: fastify.auth([
    fastify.authPipeFactory({ allowApiKey: true, allowSession: true }),
    fastify.authGuardFactory({
      isPrivilegeRequired: true,
    }),
  ]),
  handler: async (request, reply) => {
    try {
      const city = await createCity(request.body);
      return reply.status(201).send(city);
    } catch (error) {
      logger.warn(error, 'Failed to create city');
      return reply.status(500).send({ error: 'Failed to create city' });
    }
  },
});

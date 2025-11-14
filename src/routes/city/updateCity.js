const { updateCity } = require('@/useCases/cityCRUD');
const { logger } = require('@/logger');

module.exports.updateCity = (fastify) => ({
  url: '/cities/:id',
  method: 'PUT',
  bodyLimit: 2048,
  schema: {
    params: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
      required: ['id'],
    },
    body: { $ref: 'City#' },
    response: {
      200: { $ref: 'City#' },
      404: { type: 'object', properties: { error: { type: 'string' } } },
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
      const targetId = request.params.id;
      const city = await updateCity(targetId, request.body);
      if (!city) {
        return reply.status(404).send({ error: 'City not found' });
      }
      return reply.status(200).send(city);
    } catch (error) {
      logger.error(error, 'Failed to update city');
      return reply.status(500).send({ error: 'Failed to update city' });
    }
  },
});

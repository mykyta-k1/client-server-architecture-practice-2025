const { updateForecast } = require('@/useCases/forecastCRUD');
const { logger } = require('@/logger');

module.exports.updateForecast = (fastify) => ({
  url: '/forecasts/:id',
  method: 'PUT',
  bodyLimit: 4096,
  schema: {
    params: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
      required: ['id'],
    },
    body: { $ref: 'CreateForecast#' },
    response: {
      200: { $ref: 'Forecast#' },
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
      const forecast = await updateForecast(targetId, request.body);
      if (!forecast) {
        return reply.status(404).send({ error: 'Forecast not found' });
      }
      return reply.status(200).send(forecast);
    } catch (error) {
      logger.warn(error, 'Failed to update forecast');
      return reply.status(500).send({ error: 'Failed to update forecast' });
    }
  },
});

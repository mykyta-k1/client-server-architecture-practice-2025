const { createForecast } = require('@/useCases/forecastCRUD');
const { logger } = require('@/logger');

// Be sure to specify the ID as the repository does not use new ObjectId()
module.exports.createForecast = (fastify) => ({
  url: '/forecasts',
  method: 'POST',
  bodyLimit: 4096,
  schema: {
    body: { $ref: 'CreateForecast#' },
    response: {
      201: { $ref: 'Forecast#' },
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
      const forecast = await createForecast(request.body);
      return reply.status(201).send(forecast);
    } catch (error) {
      logger.warn(error, 'Failed to create forecast');
      return reply.status(500).send({ error: 'Failed to create forecast' });
    }
  },
});

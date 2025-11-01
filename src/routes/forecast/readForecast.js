const { readForecast } = require('@/useCases/forecastCRUD');
const { logger } = require('@/logger');

module.exports = {
  readForecast: {
    url: '/forecasts/:id',
    method: 'GET',
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
    },
    handler: async (request, reply) => {
      try {
        const targetId = request.params.id;
        const foundForecast = await readForecast(targetId);
        if (!foundForecast) {
          return reply.status(404).send({ error: 'Forecast not found' });
        }
        return reply.status(200).send(foundForecast);
      } catch (error) {
        logger.warn(error, 'Failed to fetch forecast by id');
        return reply.status(500).send({ error: 'Failed to fetch forecast' });
      }
    },
  },
};

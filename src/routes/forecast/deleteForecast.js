const { deleteForecast } = require('@/useCases/forecastCRUD');
const { logger } = require('@/logger');

module.exports = {
  deleteForecast: {
    url: '/forecasts/:id',
    method: 'DELETE',
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
        const deleted = await deleteForecast(targetId);
        if (!deleted) {
          return reply.status(404).send({ error: 'Forecast not found' });
        }
        return reply.status(204).send(deleted);
      } catch (error) {
        logger.warn(error, 'Failed to delete forecast by id');
        return reply.status(500).send({ error: 'Failed to delete forecast' });
      }
    },
  },
};

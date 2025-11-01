const { readCity } = require('@/useCases/cityCRUD');
const { logger } = require('@/logger');

module.exports = {
  readCity: {
    url: '/cities/:id',
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
        const foundCity = await readCity(targetId);
        if (!foundCity) {
          return reply.status(404).send({ error: 'City not found' });
        }
        return reply.status(200).send(foundCity);
      } catch (error) {
        logger.error(error, 'Failed to fetch city by id');
        return reply.status(500).send({ error: 'Failed to fetch city' });
      }
    },
  },
};

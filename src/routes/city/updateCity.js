const { updateCity } = require('@/useCases/cityCRUD');
const { logger } = require('@/logger');

module.exports = {
  updateCity: {
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
      body: {
        type: 'object',
        required: ['name', 'country'],
        properties: {
          name: { type: 'string' },
          country: { type: 'string' },
          population: { type: 'number' },
          numberOfSearches: { type: 'number' },
        },
      },
    },
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
  },
};

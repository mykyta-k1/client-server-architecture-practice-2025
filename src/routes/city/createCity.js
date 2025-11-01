const { createCity } = require('@/useCases/cityCRUD');
const { logger } = require('@/logger');

module.exports = {
  createCity: {
    url: '/cities',
    method: 'POST',
    bodyLimit: 1024,
    schema: {
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
        const city = await createCity(request.body);
        return reply.status(201).send(city);
      } catch (error) {
        logger.warn(error, 'Failed to create city');
        return reply.status(500).send({ error: 'Failed to create city' });
      }
    },
  },
};

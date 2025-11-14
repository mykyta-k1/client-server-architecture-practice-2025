const { searchCity } = require('@/useCases/searchCity');
const { logger } = require('@/logger');

module.exports = {
  searchCity: {
    url: '/cities/forecast',
    method: 'POST',
    bodyLimit: 512,
    schema: {
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' },
        },
      },
      response: {
        404: { type: 'object', properties: { error: { type: 'string' } } },
      },
    },
    handler: async (request, reply) => {
      try {
        const city = request.body;
        const forecast = await searchCity(city.name);
        return reply.status(200).send(forecast);
      } catch (error) {
        logger.error(error, error.message);
        return reply.status(404).send({ error: error.message });
      }
    },
  },
};

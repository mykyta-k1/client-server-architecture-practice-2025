const { createForecast } = require('@/useCases/forecastCRUD');
const { logger } = require('@/logger');

// Be sure to specify the ID as the repository does not use new ObjectId()
module.exports = {
  createForecast: {
    url: '/forecasts',
    method: 'POST',
    bodyLimit: 4096,
    schema: {
      body: {
        type: 'object',
        required: ['_id'],
        properties: {
          _id: { type: 'string' },
          city: {
            type: 'object',
            properties: {
              coord: {
                type: 'object',
                properties: {
                  lat: { type: 'number' },
                  lon: { type: 'number' },
                },
              },
              timezone: { type: 'integer' },
              sunrise: { type: 'integer' },
              sunset: { type: 'integer' },
            },
          },
          list: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                forecastTime: { type: 'string', format: 'date-time' },
                main: {
                  type: 'object',
                  properties: {
                    temp: { type: 'number' },
                    feelsLike: { type: 'number' },
                    tempMin: { type: 'number' },
                    tempMax: { type: 'number' },
                    pressure: { type: 'integer' },
                    seaLevel: { type: 'integer' },
                    grndLevel: { type: 'integer' },
                    humidity: { type: 'integer' },
                    tempKf: { type: 'number' },
                  },
                },
                weather: {
                  type: 'array',
                  properties: {
                    main: { type: 'string' },
                    description: { type: 'string' },
                    icon: { type: 'string' },
                  },
                },
                clouds: {
                  type: 'object',
                  properties: {
                    all: { type: 'integer' },
                  },
                },
                wind: {
                  type: 'object',
                  properties: {
                    speed: { type: 'number' },
                    deg: { type: 'integer' },
                    gust: { type: 'number' },
                  },
                },
                visibility: { type: 'integer' },
                pop: { type: 'integer' },
                sys: {
                  type: 'object',
                  properties: {
                    pod: { type: 'string' },
                  },
                },
                dtTxt: { type: 'string' },
              },
            },
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
    handler: async (request, reply) => {
      try {
        const forecast = await createForecast(request.body);
        return reply.status(201).send(forecast);
      } catch (error) {
        logger.warn(error, 'Failed to create forecast');
        return reply.status(500).send({ error: 'Failed to create forecast' });
      }
    },
  },
};

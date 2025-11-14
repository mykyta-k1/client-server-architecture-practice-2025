/** @type {Docs.JsonSchemaWithId} */
module.exports.forecastSchema = {
  $id: 'Forecast',
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
            items: {
              type: 'object',
              properties: {
                main: { type: 'string' },
                description: { type: 'string' },
                icon: { type: 'string' },
              },
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
};

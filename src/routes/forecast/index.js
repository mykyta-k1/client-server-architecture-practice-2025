const { createForecast } = require('./createForecast');
const { readForecast } = require('./readForecast');
const { updateForecast } = require('./updateForecast');
const { deleteForecast } = require('./deleteForecast');

module.exports.forecastRouter = async function (fastify) {
  fastify.route(createForecast(fastify));
  fastify.route(readForecast);
  fastify.route(updateForecast(fastify));
  fastify.route(deleteForecast(fastify));
};

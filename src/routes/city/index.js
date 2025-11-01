const { createCity } = require('./createCity');
const { readCity } = require('./readCity');
const { updateCity } = require('./updateCity');
const { deleteCity } = require('./deleteCity');

const { searchCity } = require('./searchCity');

module.exports.citiesRouter = async function (fastify) {
  fastify.route(createCity);
  fastify.route(readCity);
  fastify.route(updateCity);
  fastify.route(deleteCity);
  fastify.route(searchCity);
};

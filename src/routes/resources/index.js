const { createResource } = require('./createResource');

const { getResource } = require('./getResource');
const { getResources } = require('./getResources');

const { updateResource } = require('./updateResource');
const { patchResource } = require('./patchResource');

const { deleteResource } = require('./deleteResource');

module.exports.resourcesRouter = async function (fastify, _opts) {
  fastify.route(createResource);
  fastify.route(getResources);
  fastify.route(getResource);
  fastify.route(updateResource);
  fastify.route(patchResource);
  fastify.route(deleteResource);
};

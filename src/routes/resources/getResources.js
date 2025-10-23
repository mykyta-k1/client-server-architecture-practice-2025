const { resourceRepository } = require('@/repositories/resources');

module.exports = {
  getResources: {
    url: '/resources',
    method: 'GET',
    handler: async (request, reply) => {
      try {
        const list = await resourceRepository.read();

        return reply.status(200).send(list);
      } catch (error) {
        request.log.error(error);
        return reply.status(500).send({ error: 'Failed to fetch resources' });
      }
    },
  },
};

const { resourceRepository } = require('@/repositories/resources');

module.exports = {
  getResource: {
    url: '/resources/:id',
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
        const found = await resourceRepository.read(targetId);

        if (!found) {
          return reply.status(404).send({ error: 'Resource not found' });
        }

        return reply.status(200).send(found);
      } catch (error) {
        request.log.error(error);
        return reply.status(500).send({ error: 'Failed to fetch resource' });
      }
    },
  },
};

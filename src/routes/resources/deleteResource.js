const { resourceRepository } = require('@/repositories/resources');

module.exports = {
  deleteResource: {
    url: '/resources/:id',
    method: 'DELETE',
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
        const deleted = await resourceRepository.delete(targetId);

        return reply.status(200).send(deleted);
      } catch (error) {
        request.log.error(error);
        return reply.status(500).send({ error: 'Failed to delete resource' });
      }
    },
  },
};

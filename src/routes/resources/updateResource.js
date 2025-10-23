const { resourceRepository } = require('@/repositories/resources');

module.exports = {
  updateResource: {
    url: '/resources/:id',
    method: 'PUT',
    bodyLimit: 1024,
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
      body: {
        type: 'object',
        required: ['name', 'type'],
        properties: {
          name: { type: 'string' },
          type: { type: 'string' },
          price: { type: 'number' },
          amount: { type: 'number' },
        },
      },
    },
    handler: async (request, reply) => {
      try {
        const targetId = request.params.id;
        const { name, type, price = 0, amount = 0 } = request.body;

        const updated = await resourceRepository.update(targetId, {
          name,
          type,
          price,
          amount,
        });

        return reply.status(200).send(updated);
      } catch (error) {
        request.log.error(error);
        return reply.status(500).send({ error: 'Failed to update resource' });
      }
    },
  },
};

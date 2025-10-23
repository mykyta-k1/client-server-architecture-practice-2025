const { resourceRepository } = require('@/repositories/resources');

module.exports = {
  patchResource: {
    url: '/resources/:id',
    method: 'PATCH',
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
        properties: {
          name: { type: 'string' },
          type: { type: 'string' },
          price: { type: 'number' },
          amount: { type: 'number' },
        },
        additionalProperties: false,
      },
    },
    handler: async (request, reply) => {
      try {
        const targetId = request.params.id;
        const { price = 0, amount = 0 } = request.body;

        const updated = await resourceRepository.update(targetId, {
          price,
          amount,
        });

        return reply.status(200).send(updated);
      } catch (error) {
        request.log.error(error);
        return reply.status(500).send({ error: 'Failed to patch resource' });
      }
    },
  },
};

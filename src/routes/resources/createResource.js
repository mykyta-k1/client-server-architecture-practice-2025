const { resourceRepository } = require('@/repositories/resources');

module.exports = {
  createResource: {
    url: '/resources',
    method: 'POST',
    bodyLimit: 1024,
    schema: {
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
        const { name, type, price = 0, amount = 0 } = request.body;

        const resource = await resourceRepository.create({
          name,
          type,
          price,
          amount,
        });

        return reply.status(201).send(resource);
      } catch (error) {
        request.log.error(error);
        return reply.status(500).send({ error: 'Failed to create resource' });
      }
    },
  },
};

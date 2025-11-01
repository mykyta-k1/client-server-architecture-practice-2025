const { deleteCity } = require('@/useCases/cityCRUD');
const { logger } = require('@/logger');

module.exports = {
  deleteCity: {
    url: '/cities/:id',
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
        const deleted = await deleteCity(targetId);
        if (!deleted) {
          return reply.status(404).send({ error: 'City not found' });
        }
        return reply.status(204).send(deleted);
      } catch (error) {
        logger.error(error, 'Failed to delete city by id');
        return reply.status(500).send({ error: 'Failed to delete resource' });
      }
    },
  },
};

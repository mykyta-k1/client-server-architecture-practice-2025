module.exports = {
  async echoRoute(fastify) {
    fastify.post('/echo', async (request) => {
      return request.body;
    });

    fastify.get('/echo', async (request) => {
      return { message: 'Echo GET endpoint is working!' };
    });
  },
};

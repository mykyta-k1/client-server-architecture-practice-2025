const { MongoClient } = require('mongodb');
const { env } = require('@/config');

/**
 * Context object to hold the MongoDB client and database instance
 */
const ctx = Object.assign(Object.create(null), {
  client: null,
  db: null,
});

/**
 * Test the MongoDB connection and initialize the database instance
 */
const testConnection = async () => {
  const client = new MongoClient(env.MONGO_DATABASE_URL);
  ctx.client = client;

  await client.connect();
  ctx.db = client.db(env.MONGO_DB_NAME);
};

/**
 * Close the MongoDB connection
 */
const closeConnection = async () => {
  if (ctx.client) {
    await ctx.client.close();
  }
};

/**
 * Get MongoDB collections
 */
const $cols = {
  forecasts: () => ctx.db.collection('forecasts'),
};

module.exports = {
  $db: () => ctx.db,
  closeConnection,
  testConnection,
  $cols,
};

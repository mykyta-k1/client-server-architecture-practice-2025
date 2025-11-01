const { env } = require('@/config');
const { drizzle } = require('drizzle-orm/node-postgres');

const $db = drizzle(env.PG_DATABASE_URL);

/**
 * Test the Postgres connection
 */
const testConnection = async () => {
  await $db.execute('SELECT 1');
};

/**
 * Close the Postgres connection
 */
const closeConnection = async () => {
  await $db.$client.end();
};

module.exports = {
  $schemas: require('./schemas'),
  closeConnection,
  testConnection,
  $db,
};

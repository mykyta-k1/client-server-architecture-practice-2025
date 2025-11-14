const { Pool } = require('pg');
const { env } = require('@/config');
const { drizzle } = require('drizzle-orm/node-postgres');

const schemasWithRelations = require('./schemas');

/**
 * @description Load all schema definitions except relations
 * @type {Adapters.Postgres.Schemas}
 */
const schemas = Object.create(null);

for (const [key, value] of Object.entries(schemasWithRelations)) {
  if (!key.toLowerCase().endsWith('relations')) {
    schemas[key] = value;
  }
}

const pool = new Pool({ connectionString: env.PG_DATABASE_URL });

const $db = drizzle(pool, {
  schema: schemasWithRelations,
  casing: 'snake_case',
});

/**
 * Test the Postgres connection
 */
const testConnection = async () => {
  await pool.query('SELECT 1');
};

/**
 * Close the Postgres connection
 */
const closeConnection = async () => {
  await pool.end();
};

module.exports = {
  $schemas: schemas,
  closeConnection,
  testConnection,
  $db,
};

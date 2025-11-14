if (!process.env.APP_ENV_LOADED) {
  require('dotenv').config();
}

const { defineConfig } = require('drizzle-kit');

/**
 * Drizzle configuration for PostgreSQL database.
 * * Reading schemas from dir
 * * Generating migration files to dir
 * * Executing connection the database URL from env variables
 */
module.exports = defineConfig({
  out: './drizzle',
  schema: './src/adapters/postgres/schemas',
  dialect: 'postgresql',
  casing: 'snake_case',
  dbCredentials: {
    url: process.env.PG_DATABASE_URL,
  },
});

const {
  pgTable,
  uuid,
  varchar,
  bigint,
  integer,
  timestamp,
} = require('drizzle-orm/pg-core');

/**
 * Schema PostgreSQL table by name 'cities'
 */
module.exports.cities = pgTable('cities', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name').notNull().unique(),
  country: varchar('country').notNull(),
  population: bigint('population', { mode: 'number' }),
  numberOfSearches: integer('number_of_searches').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

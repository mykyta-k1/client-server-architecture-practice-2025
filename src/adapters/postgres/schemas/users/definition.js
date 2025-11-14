const {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
} = require('drizzle-orm/pg-core');

module.exports.users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 32 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 64 }).notNull(),
  isPrivileged: boolean().notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

const { relations } = require('drizzle-orm');
const { sessions } = require('@/adapters/postgres/schemas/sessions/definition');
const { users } = require('@/adapters/postgres/schemas/users/definition');

/**
 * Define relations for the 'users' table
 * - A user can have many sessions
 */
module.exports.userRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
}));

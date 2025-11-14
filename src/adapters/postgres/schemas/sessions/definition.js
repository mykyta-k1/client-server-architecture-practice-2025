const {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
} = require('drizzle-orm/pg-core');

module.exports.sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  fp: varchar('fp', { length: 64 }).unique().notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => require('../users/definition').users.id, {
      onDelete: 'cascade',
    }),
  ipAddress: varchar('ip_address', { length: 45 }).notNull(),
  userAgent: text('user_agent').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastSeenAt: timestamp('last_seen_at').defaultNow().notNull(),
});

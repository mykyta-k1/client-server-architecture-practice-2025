/**
 * @module adapters/postgres/schemas/sessions
 *
 * This module exports the combined schema and relations for the 'sessions' table.
 */
module.exports.sessions =
  require('@/adapters/postgres/schemas/sessions/definition').sessions;
module.exports.sessionRelations =
  require('@/adapters/postgres/schemas/sessions/relations').sessionRelations;

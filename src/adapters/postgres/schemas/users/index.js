/**
 * @module adapters/postgres/schemas/users
 *
 * This module exports the combined schema and relations for the 'users' table.
 */
module.exports.users =
  require('@/adapters/postgres/schemas/users/definition').users;
module.exports.userRelations =
  require('@/adapters/postgres/schemas/users/relations').userRelations;

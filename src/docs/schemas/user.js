/** @type {Docs.JsonSchemaWithId} */
module.exports.userSchema = {
  $id: 'User',
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    email: { type: 'string', format: 'email' },
    username: { type: 'string', minLength: 1 },
    isPrivileged: { type: 'boolean' },
  },
  required: ['id', 'username', 'email', 'isPrivileged'],
  additionalProperties: false,
};

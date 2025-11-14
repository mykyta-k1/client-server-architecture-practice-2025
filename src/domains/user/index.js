/**
 * @implements {Domain.UserEntity}
 */
class User {
  /**
   * @param {Domain.UserConstructorFields} fields
   */
  constructor(fields) {
    this.id = fields.id;
    this.email = fields.email;
    this.username = fields.username;
    this.passwordHash = fields.passwordHash;
    this.isPrivileged = false;
  }
}

module.exports = { User };

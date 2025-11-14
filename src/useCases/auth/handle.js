const { logger } = require('@/logger');
const { usersRepository } = require('@/repositories/users');
const { authService } = require('@/services/auth');

/**
 * @param {string} userId
 * @param {string} sessionId
 * @param {{
 *  ipAddress: string,
 *   userAgent: string,
 * }} deviceInfo
 */
module.exports.handleSessionAuth = async (userId, sessionId, deviceInfo) => {
  try {
    const userWithSession = await usersRepository.findByIdWithTargetSession(
      userId,
      sessionId
    );

    if (!userWithSession) {
      throw httpError(403, 'Session not valid or has expired');
    }

    const { session, ...user } = userWithSession;

    if (session.ipAddress !== deviceInfo.ipAddress) {
      logger.warn(
        `IP address mismatch for session ${sessionId} of user ${userId}: expected ${session.ipAddress}, got ${deviceInfo.ipAddress}. User agent: ${deviceInfo.userAgent}`
      );
    }

    return authService.hideSensitiveData(user);
  } catch (err) {
    throw httpError(500, 'Failed to retrieve session info.', err);
  }
};

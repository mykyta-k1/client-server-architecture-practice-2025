const { httpError } = require('@/errors');
const { logger } = require('@/logger');
const {
  session: { LAST_SEEN_UPDATE_INTERVAL_MS },
} = require('@/config');

const { usersRepository } = require('@/repositories/users');
const { sessionsRepository } = require('@/repositories/sessions');

const { authService } = require('@/services/auth');

module.exports.executeInfoQuery = async (userId, sessionId) => {
  try {
    const userWithSession = await usersRepository.findByIdWithTargetSession(
      userId,
      sessionId
    );

    if (!userWithSession) {
      throw httpError(404, 'Session not found');
    }

    const {
      session: { ipAddress, userAgent, createdAt, lastSeenAt },
      ...user
    } = userWithSession;

    const safeUser = authService.hideSensitiveData(user);
    const now = new Date();

    if (now.getTime() - lastSeenAt.getTime() > LAST_SEEN_UPDATE_INTERVAL_MS) {
      await sessionsRepository
        .touch(sessionId)
        .then((res) => {
          if (!res) {
            logger.warn(
              `Session ${sessionId} for user ${userId} not found during lastSeenAt update.`
            );
          }
        })
        .catch((error) => {
          logger.error(
            error,
            `Failed to update lastSeenAt for session ${sessionId} of user ${userId}:`
          );
        });
    }

    return {
      user: safeUser,
      session: {
        id: sessionId,
        ipAddress,
        userAgent,
        createdAt,
        lastSeenAt: now,
      },
    };
  } catch (err) {
    throw httpError(500, 'Failed to retrieve session info.', err);
  }
};

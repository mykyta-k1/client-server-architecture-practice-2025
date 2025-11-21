const { it, describe, mock } = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcrypt');

function makeUserRecord(fields = {}) {
  return Object.assign(
    {
      id: null,
      email: 'boba@examaple.com',
      username: 'Boba',
      passwordHash: null,
      isPrivileged: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    fields
  );
}

describe('Auth service — bad cases', () => {
  /**
   * Checks missing user throws an error
   */
  it('#authenticate — throws when user is missing', async () => {
    const { authService } = require('@/services/auth');

    // @ts-ignore - mocked data
    await assert.rejects(async () => authService.authenticate(null, null), {
      message: /not found/,
    });
  });

  /**
   * Checks invalid credentials throw an error
   */
  it('#authenticate — invalid credentials throw', async () => {
    const { authService } = require('@/services/auth');

    const user = makeUserRecord({
      passwordHash: await bcrypt.hash('correct-password', 10),
    });

    // @ts-ignore - mocked data
    await assert.rejects(async () => authService.authenticate(user, 'wrong'), {
      message: 'Invalid credentials',
    });
  });

  /**
   * Checks silent mode returns null instead of throwing an error
   */
  it('#authenticate — silent mode return null', async () => {
    const { authService } = require('@/services/auth');

    const user = makeUserRecord({
      passwordHash: await bcrypt.hash('correct-password', 10),
    });

    // @ts-ignore - mocked data
    const result = await authService.authenticate(user, 'wrong', true);
    assert.strictEqual(result, null);
  });
});

describe('Auth service — good cases', () => {
  /**
   * Checks credentials in silent mode returns null instead of throwing an error
   */
  it('#authenticate — silent mode returns null', async () => {
    const { authService } = require('@/services/auth');

    const user = makeUserRecord({
      passwordHash: await bcrypt.hash('secret', 10),
    });

    // @ts-ignore - mocked data
    const result = await authService.authenticate(user, 'secret', true);

    assert.strictEqual(result, null);
  });

  /**
   * Checks successful authentication returns user without passwordHash
   */
  it('#authenticate — successful returns user without passwordHash', async () => {
    const { authService } = require('@/services/auth');

    const uuid = '11111111-1111-1111-1111-111111111111';

    const userRecord = makeUserRecord({
      id: uuid,
      passwordHash: await bcrypt.hash('secret', 10),
    });

    // @ts-ignore - mocked data
    const user = await authService.authenticate(userRecord, 'secret');

    assert.strictEqual(user.passwordHash, null);
    assert.strictEqual(user.id, uuid);
    assert.strictEqual(user.username, userRecord.username);
  });

  /**
   * Checks authorize creates a session and returns user
   */
  it('#authorize - creates a session and returns user (mock fingerprint)', async () => {
    const fingerprint = require('@/services/auth/fingerprint');
    const originalFingerprint = fingerprint.makeFingerprint;

    // Fixed fingerprint for testing
    fingerprint.makeFingerprint = mock.fn(() => ({
      fingerprint: 'fixed-fp',
      normalizedUA: 'curl:7',
    }));

    delete require.cache[require.resolve('@/services/auth')];
    const { authService } = require('@/services/auth');

    try {
      const uuid = '11111111-1111-1111-1111-111111111111';

      const deviceInfo = { ipAddress: '127.0.0.1', userAgent: 'curl/7.79.1' };
      const authUser = makeUserRecord({
        id: uuid,
      });

      // @ts-ignore - mocked data
      const { session, user } = await authService.authorize(
        authUser,
        deviceInfo
      );

      assert.strictEqual(user, authUser);
      assert.strictEqual(session.userId, authUser.id);
      assert.strictEqual(session.ipAddress, deviceInfo.ipAddress);
      assert.strictEqual(session.fp, 'fixed-fp');
      assert.strictEqual(session.userAgent, 'curl:7');
    } finally {
      // Restore original fingerprint function
      fingerprint.makeFingerprint = originalFingerprint;
      delete require.cache[require.resolve('@/services/auth')];
    }
  });

  /**
   * Checks register hashes password and returns user entity
   */
  it('#register — hashes password and returns user entity (mock bcrypt.hash)', async () => {
    // Mock bcrypt.hash before requiring auth service
    const origHash = bcrypt.hash;
    const mockBcryptHash = mock.fn(async () => 'fake-hash-123');
    bcrypt.hash = mockBcryptHash;

    delete require.cache[require.resolve('@/services/auth')];
    const { authService } = require('@/services/auth');

    try {
      const userRecord = makeUserRecord();

      // @ts-ignore - mocked data
      const registeredUser = await authService.register(userRecord);

      assert.strictEqual(registeredUser.username, userRecord.username);
      assert.strictEqual(registeredUser.email, userRecord.email);
      assert.strictEqual(registeredUser.isPrivileged, false);
      assert.strictEqual(registeredUser.passwordHash, 'fake-hash-123');
      assert.notStrictEqual(
        registeredUser.passwordHash,
        userRecord.passwordHash
      );
    } finally {
      bcrypt.hash = origHash;
      delete require.cache[require.resolve('@/services/auth')];
    }
  });

  /**
   * Checks login authenticates and fingerprint is applied to session
   */
  it('#login - authenticates and returns session+user (mock fingerprint)', async () => {
    const fingerprint = require('@/services/auth/fingerprint');
    const originalFingerprint = fingerprint.makeFingerprint;

    fingerprint.makeFingerprint = mock.fn(() => ({
      fingerprint: 'fp-2',
      normalizedUA: 'node/test',
    }));

    delete require.cache[require.resolve('@/services/auth')];
    const { authService } = require('@/services/auth');

    try {
      const uuid = '11111111-1111-1111-1111-111111111111';
      const plainPass = 'login-pass';
      const hash = await bcrypt.hash(plainPass, 10);
      const userRecord = makeUserRecord({ id: uuid, passwordHash: hash });

      const deviceInfo = { ipAddress: '::1', userAgent: 'node/test' };

      // @ts-ignore - mocked data
      const { session, user } = await authService.login(
        userRecord,
        plainPass,
        deviceInfo
      );

      assert.strictEqual(user.id, userRecord.id);
      assert.strictEqual(session.userId, userRecord.id);
      assert.strictEqual(session.fp, 'fp-2');
    } finally {
      fingerprint.makeFingerprint = originalFingerprint;
      delete require.cache[require.resolve('@/services/auth')];
    }
  });

  /**
   * Checks hideSensitiveData removes sensitive fields from user object
   */
  it('#hideSensitiveData — removes sensitive fields from user object', async () => {
    const { authService } = require('@/services/auth');

    const uuid = '11111111-1111-1111-1111-111111111111';

    const userRecord = makeUserRecord({
      id: uuid,
      passwordHash: 'secret-hash',
    });

    const safeUser = authService.hideSensitiveData(userRecord);

    assert.strictEqual(safeUser.passwordHash, undefined);
    assert.strictEqual(safeUser.id, userRecord.id);
    assert.strictEqual(safeUser.username, userRecord.username);
  });
});

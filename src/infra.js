const { logger } = require('./logger');

const infrastructureMap = new Map();

/**
 * Bootstrap all infrastructure modules
 */
const bootstrapInfra = async () => {
  try {
    await postgresStartModule();
    await mongoStartModule();
    logger.info('🚀 All infrastructure modules initialized successfully.');
  } catch (error) {
    logger.error(error, '❌ Error during infrastructure initialization:');
    throw error;
  }
};

/**
 * Start PostgreSQL module
 */
const postgresStartModule = async () => {
  logger.info('🐘 Testing PostgreSQL connection...');
  const pgAdapter = require('@/adapters/postgres');
  await pgAdapter.testConnection();

  infrastructureMap.set('postgres', pgAdapter);
  logger.info('✅ PostgreSQL connection established.');
};

/**
 * Start MongoDB module
 */
const mongoStartModule = async () => {
  logger.info('🌱 Testing MongoDB connection...');
  const mongoAdapter = require('@/adapters/mongo');
  await mongoAdapter.testConnection();

  infrastructureMap.set('mongo', mongoAdapter);
  logger.info('✅ MongoDB connection established.');
};

/**
 * Shutdown all infrastructure modules
 */
const shutdownInfra = async () => {
  try {
    logger.info('🛑 Shutting down infrastructure modules...');
    await postgresShutdownModule();
    await mongoShutdownModule();
    logger.info('✅ All infrastructure modules shut down successfully.');
  } catch (error) {
    logger.error(error, '❌ Error during infrastructure shutdown:');
  }
};

/**
 * Shutdown PostgreSQL module
 */
const postgresShutdownModule = async () => {
  logger.info('🐘 Closing PostgreSQL connection...');
  if (infrastructureMap.has('postgres')) {
    await infrastructureMap.get('postgres').closeConnection();
    logger.info('✅ PostgreSQL connection closed.');
  }
};

/**
 * Shutdown MongoDB module
 */
const mongoShutdownModule = async () => {
  logger.info('🌱 Closing MongoDB connection...');
  if (infrastructureMap.has('mongo')) {
    await infrastructureMap.get('mongo').closeConnection();
    logger.info('✅ MongoDB connection closed.');
  }
};

module.exports = {
  isInitialized: () => infrastructureMap.size > 0,
  bootstrapInfra,
  shutdownInfra,
};

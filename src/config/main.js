export default {
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/Chat',
  SECRET_KEY: process.env.SECRET_KEY || 'secret key new medical',
  LOG_WINSTON: process.env.LOG_WINSTON || 'debug',
  REDIS: {
    HOST: process.env.REDIS_HOST || 'localhost',
    PORT: process.env.REDIS_PORT || 6379,
    USER: process.env.REDIS_USER || 'redis_user',
  },
  KEY_BULKWRITE: process.env.KEY_BULKWRITE || 'keyBulkWrite',
};

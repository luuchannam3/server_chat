export default {
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/Medical',
  SECRET_KEY: process.env.SECRET_KEY || 'secret key new medical',
  LOG_WINSTON: process.env.LOG_WINSTON || 'debug',
  KEY_BULKWRITE: process.env.KEY_BULKWRITE || 'keyBulkWrite',
};

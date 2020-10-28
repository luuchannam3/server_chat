export default {
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/Medical',
  SECRET_KEY: process.env.SECRET_KEY || 'secret key new medical',
  LOG_WINSTON: process.env.LOG_WINSTON || 'debug',
  KEY_BULKWRITE: process.env.KEY_BULKWRITE || 'keyBulkWrite',
  KAFKA_HOST: process.env.KAFKA_HOST || 'kafka:9092',
  KAFKA_TOPIC_MESSAGE: process.env.KAFKA_TOPIC_MESSAGE || 'topic_message',
  KAFKA_TOPIC_CONVERSATION: process.env.KAFKA_TOPIC_CONVERSATION || 'topic_conversation',
  REDIS: {
    HOST: process.env.REDIS_HOST || 'localhost',
    PORT: process.env.REDIS_PORT || 6379,
  },
  CMS: {
    HOST: process.env.CMS_HOST || 'http://localhost:5000',
    KEY: process.env.CMS_KEY || 'mOHooSkUvMbxdclbOGtQem6OAaWCwoVMzLt0KeW9kQ08Wu0s',
  },
  PORT: process.env.PORT || 3000,
};

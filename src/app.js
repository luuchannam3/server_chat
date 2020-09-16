import mongoose from 'mongoose';
import express from 'express';
import Redis from 'ioredis';
import config from './config/main.js';
import logger from './config/winston';
import UserAPIV1Routes from './routes/api/v1/user';
import AddressAPIV1Routes from './routes/api/v1/address';
import AvatarGroupAPIV1Routes from './routes/api/v1/avatargroup'
import FriendAPIV1Routes from './routes/api/v1/friend'
import MessageAPIV1Routes from './routes/api/v1/message'
import GroupAPIV1Routes from './routes/api/v1/group'
import ConversationAPIV1Routes from './routes/api/v1/conversation'
import multer from 'multer'

const app = express();

// RetryConnection :
function RetryConnection() {
  logger.error('MongoDB connect with retry');

  mongoose.connect(config.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

mongoose.connection.on('error', err => {
  logger.error('Database connection error: ' + err);

  setTimeout(RetryConnection, 5000);
});

mongoose.connection.on('connected', async () => {
  console.log("database connected")
  logger.info('Database connected!');
});

mongoose.connect(config.MONGO_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export const client = new Redis({
  host: config.REDIS.HOST,
  port: config.REDIS.PORT,
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use('/api/v1/user', UserAPIV1Routes);
app.use('/api/v1/address', AddressAPIV1Routes);
app.use('/api/v1/avatargroup', AvatarGroupAPIV1Routes)
app.use('/api/v1/friend',FriendAPIV1Routes)
app.use('/api/v1/message',MessageAPIV1Routes)
app.use('/api/v1/group',GroupAPIV1Routes)
app.use('/api/v1/conversation',ConversationAPIV1Routes)
export default app;

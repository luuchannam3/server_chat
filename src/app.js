import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import Redis from 'ioredis';
import cors from 'cors';
import config from './config/main';
import logger from './config/winston';
import Conversation from './controllers/conversation';
import AvatarGroup from './controllers/upload_img';
import Message from './controllers/message';

const app = express();

export const client = new Redis({
  host: config.REDIS.HOST,
  port: config.REDIS.PORT,
});

// RetryConnection :
function RetryConnection() {
  logger.error('MongoDB connect with retry');

  mongoose.connect(config.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: 'medical',
    pass: 'b@3b#Wed%Y543c4',
  });
}

mongoose.connection.on('error', (err) => {
  logger.error(`Database connection error: ${err}`);

  setTimeout(RetryConnection, 5000);
});

mongoose.connection.on('connected', async () => {
  logger.info('Database connected!');
});

mongoose.connect(config.MONGO_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/public', express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(cors());

app.route('/api/v1/conversation')
  .get(Conversation.GetConversation);

app.route('/api/v1/upload_img')
  .post(AvatarGroup.UploadImage);

app.route('/api/v1/message')
  .get(Message.GetMessage);

export default app;

import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import Redis from 'ioredis';
import cors from 'cors';
import config from './config/main';
import logger from './config/winston';
import { producer } from './config/kafka';
import { AuthMiddleware } from './middleware';
import { ConversationRoutes, MessageRoutes, UploadImgRoutes } from './routes';

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

producer.connect();

app.use('/public', express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(cors());

app.get('/healthz', (req, res) => res.status(200).json({
  msg: 'OK',
}));

app.use('/api/v1/conversation', AuthMiddleware, ConversationRoutes);
app.use('/api/v1/message', AuthMiddleware, MessageRoutes);
app.use('/api/v1/upload_img', AuthMiddleware, UploadImgRoutes);

export default app;

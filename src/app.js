import mongoose from 'mongoose';
import express from 'express';
import Redis from 'ioredis';
import config from './config/main.js';
import logger from './config/winston';
import UserAPIV1Routes from './routes/api/v1/user';
import AddressAPIV1Routes from './routes/api/v1/address';

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

mongoose.connection.on('connected', () => {
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

export default app;

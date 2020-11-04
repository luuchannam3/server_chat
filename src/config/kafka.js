import { Kafka } from 'kafkajs';
import config from './main';

const kafka = new Kafka({
  clientId: 'producer',
  // brokers: [config.KAFKA_HOST],
  brokers: 'kafka:9092',
});

export const producer = kafka.producer();

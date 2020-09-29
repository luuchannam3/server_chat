const http = require('http');
import socket from 'socket.io';
import kafka from 'kafka-node'
import app from './app';
import type from './models/type'
import $ from 'jquery';

const server = http.createServer(app);

export const io = socket(server);

const kafkaClientOptions = { sessionTimeout: 100, spinDelay: 100, retries: 2 };
const kafkaClient = new kafka.Client(process.env.KAFKA_ZOOKEEPER_CONNECT, 'producer-client', kafkaClientOptions);
const kafkaProducer = new kafka.HighLevelProducer(kafkaClient);

kafkaClient.on('error', (error) => console.error('Kafka client error:', error));
kafkaProducer.on('error', (error) => console.error('Kafka producer error:', error));


var Room =io.of('/room')
Room.on('connection', (socket) => {
  socket.join('/room')
  socket.on('chat message', (data) => {
    socket.broadcast.to('/room').emit('chat message', data.id_sender+' '+ data.message)
    socket.emit('chat message', 'You: ' + data.message)
    
    const messageBuffer = type.toBuffer({
      conversation_id: data.conversation_id,
      Content: data.message,
      isSender: data.id_sender,
    });
    const payload = [{
      topic: 'room',
      messages: messageBuffer,
      attributes: 1
    }];

    kafkaProducer.send(payload, function (error, result) {
      console.info('Sent payload to Kafka:', payload);
    });
  })
})
server.listen(5000, () => console.log('Server is start on *:5000'));

const http = require('http');
import socket from 'socket.io';
import kafka from 'kafka-node'
import app from './app';
import type from './models/type'
import $ from 'jquery';
import fs from 'fs';
const server = http.createServer(app);

export const io = socket(server);

const kafkaClientOptions = { sessionTimeout: 100, spinDelay: 100, retries: 2 };
const kafkaClient = new kafka.Client(process.env.KAFKA_ZOOKEEPER_CONNECT, 'producer-client', kafkaClientOptions);
const kafkaProducer = new kafka.HighLevelProducer(kafkaClient);

kafkaClient.on('error', (error) => console.error('Kafka client error:', error));
kafkaProducer.on('error', (error) => console.error('Kafka producer error:', error));

io.on('connection', (socket) => {
  socket.on('joinroom', (data) => {
    var room = data
    socket.join(room)
    socket.on('chat message', (data) => {
      socket.broadcast.to(room).emit('chat message', data.id_sender + ' ' + data.message)
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
    socket.on('base64 file', function (msg) {
      var string = msg.file
      let base64Image = msg.file.split(';base64,').pop();
      var chuoi = string.split(';base64')
      var c = chuoi[0].split('image/')
      var path = 'public/message/' + `${Date.now()}-${msg.conversation_id}.${c[1]}`
      console.log(path)
      fs.writeFile('public/message/' + `${Date.now()}-${msg.conversation_id}.${c[1]}`, base64Image, { encoding: 'base64' }, function (err) {
        console.log('File created');
      });
      socket.broadcast.to(room).emit('base64_file',
        {
          id_sender: msg.id_sender,
          file: msg.file,
          conversation_id: msg.conversation_id,
        }
      );
      socket.emit('base64_file',
        {
          id_sender: 'You',
          file: msg.file,
          conversation_id: msg.conversation_id,
        }
      );
      const messageBuffer = type.toBuffer({
        conversation_id: msg.conversation_id,
        Content: path,
        isSender: msg.id_sender,
      });
      const payload = [{
        topic: 'room',
        messages: messageBuffer,
        attributes: 1
      }];

      kafkaProducer.send(payload, function (error, result) {
        console.info('Sent payload to Kafka:', payload);
      });
    });
  })
})
server.listen(5000, () => console.log('Server is start on *:5000'));

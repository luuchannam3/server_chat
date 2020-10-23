import http from 'http';
import socketIO from 'socket.io';
import kafka from 'kafka-node';
import app, { client } from './app';
import config from './config/main';
import ConversationController from './controllers/conversation';
import MessageController from './controllers/message';
import GroupController from './controllers/group';
import FriendController from './controllers/friend';

const server = http.createServer(app);

export const io = socketIO(server);

const kafkaClientOptions = { sessionTimeout: 100, spinDelay: 100, retries: 2 };
const kafkaClient = new kafka.KafkaClient(config.KAFKA_HOST, 'producer-client', kafkaClientOptions);
const kafkaProducer = new kafka.HighLevelProducer(kafkaClient);

kafkaClient.on('error', (error) => console.error('Kafka client error:', error));
kafkaProducer.on('error', (error) => console.error('Kafka producer error:', error));

io.use(async (socket, next) => {
  const { uid } = socket.handshake.query;
  // eslint-disable-next-line no-param-reassign
  socket.uid = uid;
  console.log(`User connected ${uid}`);

  // set online to redis
  client.set(`${uid}_online`, 1);

  const cons = await ConversationController.GetGroupConversationByUserId(uid);

  // join chanel
  socket.join(uid);
  for (let i = 0; i < cons.length; i++) {
    console.log('prepare join', cons[i].id);
    socket.join(cons[i].id);
  }

  next();
});

io.on('connection', (socket) => {
  socket.on('send_message', (data) => {
    MessageController.SendMessage(io, socket, data);
  });

  socket.on('create_conversation', (data) => {
    ConversationController.CreateConversation(io, socket, data);
  });

  socket.on('add_user_to_group', (data) => {
    GroupController.AddUserToGroup(io, socket, data);
  });

  socket.on('remove_user_in_group', (data) => {
    GroupController.RemoveUserInGroup(io, socket, data);
  });

  socket.on('add_friend', (data) => {
    FriendController.AddFriend(io, socket, data);
  });
});

server.listen(3000, () => console.log('Server is start on *:5000'));

import http from 'http';
import socketIO from 'socket.io';
import app, { client } from './app';
import ConversationController from './controllers/conversation';
import MessageController from './controllers/message';
import GroupController from './controllers/group';
import FriendController from './controllers/friend';
import { GetUserData } from './config/axios';
import config from './config/main';
import logger from './config/winston';

const server = http.createServer(app);

export const io = socketIO(server);

io.use(async (socket, next) => {
  try {
    const { token } = socket.handshake.query;
    if (!token) {
      return next('unauthorized');
    }

    const user = await GetUserData(token);

    if (!user) {
      return next('invalid token');
    }

    const uid = user.id;

    // eslint-disable-next-line no-param-reassign
    socket.uid = uid;
    console.log(`User connected ${uid}`);

    // set online to redis
    await client.set(`${uid}_online`, 1);

    const cons = await ConversationController.GetGroupConversationByUserId(uid);

    // join chanel
    socket.join(uid);
    for (let i = 0; i < cons.length; i++) {
      console.log('prepare join', cons[i].id);
      socket.join(cons[i].id);
    }

    return next();
  } catch (e) {
    logger.error(e);
    return next('unauthorized');
  }
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

  socket.on('disconnect', async () => {
    const { uid } = socket;
    const cons = await ConversationController.GetGroupConversationByUserId(uid);

    // leave chanel
    socket.leave(uid);
    for (let i = 0; i < cons.length; i++) {
      socket.leave(cons[i].id);
    }

    // set offline in redis
    await client.del(`${uid}_online`);

    console.log(`disconnect ${uid}`);
  });
});

server.listen(5000, () => console.log('Server is start on *:5000'));

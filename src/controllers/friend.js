import { Conversation } from 'models-common';
import logger from '../config/winston';
import TypeConversation from '../constant/converstation';
import { producer } from '../config/kafka';
import config from '../config/main';

/**
 * socket event add_friend
 * uid: user_id who is send request add friend
 * fid: friend_id who will receive request add friend
 */
async function AddFriend(io, socket, data) {
  try {
    const { uid, fid } = data;

    if (!uid || !fid) {
      return io.to(socket.uid).emit('add_friend', {
        err: 'Invalid params',
      });
    }

    // TODO call HTTP to APS.NET for validate friend is exited

    const con = new Conversation({
      type: TypeConversation.PRIVATE_CHAT,
      mems: [uid, fid],
    });

    // await con.save();
    await producer.send({
      topic: config.KAFKA_TOPIC_CONVERSATION,
      messages: [
        { key: 'add_friend', value: JSON.stringify(con) },
      ],
    });

    const promises = [
      io.to(socket.uid).emit('add_friend', {
        data: { con },
      }),
      io.to(fid).emit('add_friend', {
        data: { con },
      }),
    ];

    await Promise.all(promises);
  } catch (error) {
    logger.error(`Error socket event add_friend ${error}`);
    io.to(socket.uid).emit('', {
      err: 'TODO error when add_friend',
    });
  }
}

export default { AddFriend };

import { Conversation } from 'models-common';
import statusCode from '../constant/statusCode';
import logger from '../config/winston';
import ConversationType from '../constant/converstation';
import { producer } from '../config/kafka';
import config from '../config/main';

/**
 * query params
 * uid: get list conversation.mems contains userId
 * page: pagination for query
 */
async function GetConversation(req, res) {
  try {
    const { uid } = req.query;
    const page = req.query.page || 1;
    if (!uid) {
      return res.status(statusCode.BAD_REQUEST).json({
        error: 'Invalid params',
      });
    }

    // const cons = await Conversation.find({ mems: uid }).sort('updatedAt').skip((page - 1) * 20).limit(20);
    const cons = await Conversation.find({});
    return res.status(statusCode.OK).json({
      cons,
    });
  } catch (error) {
    logger.error(`GET /api/v1/conversation ${error}`);

    res.status(statusCode.BAD_REQUEST).json({
      error: 'Bad Request',
    });
  }
}

/**
 * get list conversation by userId
 */
async function GetGroupConversationByUserId(uid) {
  const cons = await Conversation.find({ mems: uid, type: ConversationType.GROUP_CHAT }).sort('updatedAt');

  return cons;
}

/**
 * socket event create_conversation
 * ava,
 * type: 1. private chat, 2. group chat
 * name: conversation name
 * mems: array contains user.id
 */
async function CreateConversation(io, socket, data) {
  try {
    const {
      type,
      name,
      mems,
      ava,
    } = data;

    // valids params
    if (!mems || !name || mems.length < 2 || mems[0] !== socket.uid) {
      return io.to(socket.uid).emit('create_conversation', {
        err: 'Invalid params',
      });
    }

    // TODO call HTTP to APS.NET for validate friend is exited
    // TODO validate user can create group

    const con = new Conversation({
      ava: ava || 'TODO default ava',
      type: type === ConversationType.PRIVATE_CHAT ? ConversationType.PRIVATE_CHAT : ConversationType.GROUP_CHAT,
      name,
      mems,
    });

    // await con.save();

    await producer.send({
      topic: config.KAFKA_TOPIC_CONVERSATION,
      messages: [
        { key: 'create_conversation', value: JSON.stringify(con) },
      ],
    });

    const promises = [];

    for (let i = 0; i < mems.length; i++) {
      const isOnline = true;
      if (isOnline) {
        promises.push(io.to(mems[i]).emit('create_conversation', {
          data: { con },
        }));
      } else {
        // TODO push notification
      }
    }

    await Promise.all(promises);
  } catch (error) {
    logger.error(`Error socket event create_conversation ${error}`);

    io.to(socket.uid).emit('create_conversation', {
      err: 'TODO error when create conversation',
    });
  }
}

export default { GetConversation, CreateConversation, GetGroupConversationByUserId };

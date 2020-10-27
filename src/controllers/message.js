import { Conversation, Message } from 'models-common';
import statusCode from '../constant/statusCode';
import logger from '../config/winston';
import ConversationType from '../constant/converstation';
import { producer } from '../config/kafka';
import config from '../config/main';

/**
 * socket event send_message
 * cid: converation_id
 * ruid: id of user will received message or group_id
 * type: message type 1. text, 2. image
 * content: content message or image path
 */
async function SendMessage(io, socket, data) {
  const {
    cid,
    ruid,
    type,
    content,
  } = data;
  try {
    console.log('receive data', data);
    // validate params
    if (!ruid || !type || !content) {
      return io.to(socket.uid).emit('send_message', {
        err: 'Invalid params',
      });
    }
    // check cid exit
    let con = await Conversation.findById(cid);

    if (!con) {
      // create new conversation
      con = new Conversation({
        mems: [socket.uid, ruid],
        type: ConversationType.PRIVATE_CHAT,
      });

      // await con.save();
      await producer.send({
        topic: config.KAFKA_TOPIC_CONVERSATION,
        messages: [
          { key: 'new_conversation', value: JSON.stringify(con) },
        ],
      });
    }

    const mess = new Message({
      content,
      type,
      cid: con.id,
      uid: socket.uid,
    });

    // await mess.save();

    await producer.send({
      topic: config.KAFKA_TOPIC_MESSAGE,
      messages: [
        { key: 'new_message', value: JSON.stringify(mess) },
      ],
    });

    io.to(ruid).emit('send_message', {
      data: {
        mess,
      },
    });

    con.lm = mess.id;

    // await con.save();

    await producer.send({
      topic: config.KAFKA_TOPIC_CONVERSATION,
      messages: [
        { key: 'update_lm_conversation', value: JSON.stringify(con) },
      ],
    });
  } catch (error) {
    logger.error(`Error socket event send_message ${error}`);
    io.to(socket.uid).emit('send_message', {
      err: 'TODO error when send message',
    });
  }
}

/**
 * GetMessage by icd
 * query params
 * cid: conversation_id
 * page: pagination
 * uid: user_01_id,user_02_id
 */
async function GetMessage(req, res) {
  try {
    let { cid, uid } = req.query;
    const page = req.query.page || 1;

    if (!cid && !uid) {
      return res.status(statusCode.BAD_REQUEST).json({
        error: 'Invalid params',
      });
    }

    if (!cid) {
      uid = uid.split(',');
      const con = await Conversation.findOne({ mems: { $all: uid }, type: ConversationType.PRIVATE_CHAT });
      cid = con ? con.id : '';
    }

    const messages = await Message.find({ cid })
      .sort('updatedAt')
      .skip((page - 1) * 20)
      .limit(20)
      .populate('uid');

    return res.status(statusCode.OK).json({
      messages,
    });
  } catch (error) {
    logger.error(`api GET /api/v1/messages ${error}`);

    res.status(statusCode.BAD_REQUEST).json({
      error: 'Bad Request',
    });
  }
}

export default { SendMessage, GetMessage };

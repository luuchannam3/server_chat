import { Conversation, Message } from 'models-common';
import statusCode from '../constant/statusCode';
import logger from '../config/winston';
import ConversationType from '../constant/converstation';

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

      await con.save();
    }

    const mess = new Message({
      content,
      type,
      cid: con.id,
      uid: socket.uid,
    });

    await mess.save();

    io.to(ruid).emit('send_message', {
      data: {
        mess,
      },
    });

    con.lm = mess.id;

    await con.save();
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
 */
async function GetMessage(req, res) {
  try {
    const { cid } = req.query;
    const page = req.query.page || 1;

    if (!cid) {
      return res.status(statusCode.BAD_REQUEST).json({
        error: 'Invalid params',
      });
    }

    const messages = await Message.find({ cid }).sort('updatedAt').skip((page - 1) * 20).limit(20);

    return res.status(statusCode.OK).json({
      messages,
    });
  } catch (error) {
    logger.error(`Error socket event send_message ${error}`);

    res.status(statusCode.BAD_REQUEST).json({
      error: 'Bad Request',
    });
  }
}

export default { SendMessage, GetMessage };

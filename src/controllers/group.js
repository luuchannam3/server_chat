import { Conversation } from 'models-common';
import logger from '../config/winston';
import { producer } from '../config/kafka';
import config from '../config/main';

/**
 * socket event add_user_to_group
 * cid: group chat's conversation_id
 * newUserId: new user who will add to group
 */
async function AddUserToGroup(io, socket, data) {
  try {
    const { cid, newUserId } = data;
    // check group is exited
    const con = await Conversation.findById(cid);

    if (!con) {
      return io.to(socket.uid).emit('add_user_to_group', {
        err: 'TODO error group not found',
      });
    }

    const { mems } = con;

    // check roles user
    if (mems[0] !== socket.uid) {
      return io.to(socket.uid).emit('add_user_to_group', {
        err: 'TODO You can not add new user to group',
      });
    }

    await producer.send({
      topic: config.KAFKA_TOPIC_CONVERSATION,
      messages: [
        { key: 'add_user_to_group', value: JSON.stringify({ _id: cid, newUserId }) },
      ],
    });

    // await Conversation.findByIdAndUpdate(
    //   { _id: cid },
    //   { $push: { members: newUserId } },
    //   { new: true },
    // );

    return io.to(cid).emit('add_user_to_group', {
      msg: 'TODO New user was added to your group',
    });
  } catch (error) {
    logger.error(`Error socket event add_user_to_group ${error}`);

    io.to(socket.uid).emit('add_user_to_group', {
      err: 'TODO error when add new user to group',
    });
  }
}

/**
 * socket event remove_user_in_group
 * cid: group chat's conversation_id
 * uid: user request remove user in group,
 * removeUserId: user who will remove in group
 */
async function RemoveUserInGroup(io, socket, data) {
  try {
    const { cid, uid, removeUserId } = data;
    // check group is exited
    const con = await Conversation.findById(cid);
    const { mems } = con;

    // check roles user
    if (mems[0] !== uid) {
      return io.to(uid).emit('remove_user_in_group', {
        msg: 'TODO You can not add new user to group',
      });
    }

    await Conversation.updateOne(
      { _id: cid },
      { $pull: { members: { id: removeUserId } } },
      { safe: true, multi: true },
    );

    return io.to(cid).emit('remove_user_in_group', {
      msg: 'TODO Remove user in group',
    });
  } catch (error) {
    logger.error(`Error socket event remove_user_in_group ${error}`);

    io.to(socket.userId).emit('remove_user_in_group', {
      msg: 'TODO error when remove user in group',
    });
  }
}

export default {
  AddUserToGroup, RemoveUserInGroup,
};

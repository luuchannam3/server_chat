import { Conversation, Message } from 'models-common';

export const ResetDB = async () => {
  await Conversation.deleteMany({});
  await Message.deleteMany({});
};

export const SetUpDB = async () => {
  const con = new Conversation({
    type: 1,
    mems: ['user_01', 'user_02'],
  });

  await con.save();

  const mess = new Message({
    content: 'send from user 01',
    uid: 'user_01',
    cid: con.id,
  });

  await mess.save();

  return {
    cid: con.id,
    uid: 'user_01',
    mid: mess.id,
  };
};

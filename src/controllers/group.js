// import Group from '../models/group';
import statusCode from '../constant/statusCode';
import logger from '../config/winston';
import Group from '../models/group';
import Conversation from '../models/conversation';
import GroupChat from '../models/group_chat';

function makeid(length) {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function GetGroup(req, res) {
  try {
    const groupId = req.query.groupId;
    let query;
    if (groupId != undefined) {
      query = Group.find({ _id: groupId }).sort('created');
      query.exec((err, groups) => {
        if (err) res.send(err);
        res.status(statusCode.OK).json({ groups });
      });
    } else {
      query = Group.find({}).sort('created');
      query.exec((err, groups) => {
        if (err) res.send(err);
        res.status(statusCode.OK).json({ groups });
      });
    }
  } catch (error) {
    logger.error(`GET /api/v1/group ${error}`);

    res.status(statusCode.BAD_REQUEST).json({
      error: 'Bad Request',
    });
  }
}
// loi
function CreateGroup(req, res) {
  try {
    let id;
    // create groupId
      id = '-' + makeid(19).toString();
    console.log('create');
    const avatarGroup = req.body.avatarGroup;
    const description = req.body.description;
    const nameGroup = req.body.nameGroup;
    const members = req.body.members;
    const userId = req.query.userId;

    const group1 = new Group({
      _id: id,
      id_user: userId,
      avatarGroup: avatarGroup,
      description: description,
      members: members,
      nameGroup: nameGroup
    });

    group1.save((err) => {
      if (err) console.log(err);
    });

    // create new conversation
    const conversation = new Conversation({
      _id: id,
      lm: '',
      url: avatarGroup,
      type: 1,
      name: nameGroup,
      listviewer: [],
      members: members
    });
    conversation.save((err) => {
      if (err) console.log(err);
    });

    // create new GroupChat
    const groupChat=new GroupChat({
      id_Conversation: id,
      Content: "Hello",
      isImage: false,
      isSender: userId
    });
    groupChat.save((err)=>{
      if(err) console.log(err);
    });
    res.status(statusCode.OK).json({ group1 });
  } catch (error) {
    logger.error(`POST /api/v1/group ${error}`);

    res.status(statusCode.BAD_REQUEST).json({
      error: 'Bad Request',
    });
  }
}
//
function AddUserToGroup(req, res) {
  try {
    const groupId = req.query.groupId;
    const member = req.body;

    if (groupId != undefined) {
      Group.findOneAndUpdate(
        { _id: groupId },
        { $push: { members: member } },
        { new: true }
      );
    }
    else {
      res.status(statusCode.BAD_REQUEST).json({
        error: 'You cannot add',
      });
    }

    res.status(statusCode.OK).json(member);
  } catch (error) {
    logger.error(`Put /api/v1/group ${error}`);

    res.status(statusCode.BAD_REQUEST).json({
      error: 'Bad Request',
    });
  }
}

function DeleteUserInGroup(req, res) {
  try {
    const groupId = req.query.groupId;
    const userId = req.query.userId;
    const memberId = req.query.memberId;
    let group;
    if (groupId != undefined && userId != undefined && memberId != undefined) {
      group = Group.findOne({ _id: groupId });
      let id;
      group.exec((err, groups) => {
        if (err) res.send(err);
        id=groups.id_user;
        if (userId == id) {
          // delete user in group
          Group.updateOne({ _id: groupId, id_user: userId }, { "$pull": { "members": { "id": memberId } } }, { safe: true, multi: true });
          res.status(statusCode.OK).json({
            memberId: memberId,
            groupId: groupId
          });
        }
        else {
          res.status(statusCode.BAD_REQUEST).json({
            error: 'you cannot delete',
          });
          return;
        }
      });
    }
    else {
      res.status(statusCode.BAD_REQUEST).json({
        error: 'you cannot delete',
      });
    }
  } catch (error) {
    logger.error(`Delete /api/v1/group ${error}`);

    res.status(statusCode.BAD_REQUEST).json({
      error: 'Bad Request',
    });
  }
}
export default { GetGroup, CreateGroup, AddUserToGroup, DeleteUserInGroup };

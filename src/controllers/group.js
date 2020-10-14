// import Group from '../models/group';
import statusCode from '../constant/statusCode';
import logger from '../config/winston';
import Group from '../models/group';
import Conversation from '../models/conversation'
import Group_Chat from '../models/group_chat'

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function GetGroup(req, res) {
  try {
    const group_id = req.query.group_id;
    var query
    if (group_id != undefined) {
      query = Group.find({ _id: group_id }).sort('created');
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
    // create group_id
      id = '-' + makeid(19).toString();
      // let temp = Group.find({ _id: id });
      // temp.exec((err) => {
      //   if (err) check = false;
      //   check = true;
      // });
    // create new group
    console.log('create');
    const avatarGroup = req.body.avatarGroup;
    const description = req.body.description;
    const nameGroup = req.body.nameGroup;
    const members = req.body.members;
    const user_id = req.query.user_id;

    const group1 = new Group({
      _id: id,
      id_user: user_id,
      avatarGroup: avatarGroup,
      description: description,
      members: members,
      nameGroup: nameGroup
    });

    group1.save((err) => {
      if (err) console.log(err)
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
    })
    conversation.save((err) => {
      if (err) console.log(err)
    })

    // create new Group_Chat
    const group_chat=new Group_Chat({
      id_Conversation: id,
      Content: "Hello",
      isImage: false,
      isSender: user_id
    })
    group_chat.save((err)=>{
      if(err) console.log(err)
    })
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
    const group_id = req.query.group_id;
    const member = req.body

    if (group_id != undefined) {
      // Group.findOneAndUpdate(
      //   { _id: group_id },
      //   { $push: { members: member } },
      //   { new: true }, (err, result) => {

      //   }
      // )
      Group.findOneAndUpdate(
        { _id: group_id },
        { $push: { members: member } },
        { new: true }
      )
    }
    else {
      res.status(statusCode.BAD_REQUEST).json({
        error: 'You cannot add',
      })
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
    const group_id = req.query.group_id;
    const user_id = req.query.user_id;
    const member_id = req.query.member_id;
    var group
    if (group_id != undefined && user_id != undefined && member_id != undefined) {
      group = Group.findOne({ _id: group_id });
      var id
      group.exec((err, groups) => {
        if (err) res.send(err);
        id=groups.id_user
        if (user_id == id) {
          // delete user in group
          Group.updateOne({ _id: group_id, id_user: user_id }, { "$pull": { "members": { "id": member_id } } }, { safe: true, multi: true });
          res.status(statusCode.OK).json({
            member_id: member_id,
            group_id: group_id
          });
        }
        else {
          res.status(statusCode.BAD_REQUEST).json({
            error: 'you cannot delete',
          })
          return
        }
      });
      // console.log(id)
    }
    else {
      res.status(statusCode.BAD_REQUEST).json({
        error: 'you cannot delete',
      })
    }
  } catch (error) {
    logger.error(`Delete /api/v1/group ${error}`);

    res.status(statusCode.BAD_REQUEST).json({
      error: 'Bad Request',
    });
  }
}
export default { GetGroup, CreateGroup, AddUserToGroup, DeleteUserInGroup };

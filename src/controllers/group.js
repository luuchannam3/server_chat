// import Group from '../models/group';
import statusCode from '../constant/statusCode';
import logger from '../config/winston';
import Group from '../models/group';
import user from '../models/user';
import Conversation from '../models/conversation'

function makeid(length) {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}


export async function GetGroup(req, res) {
  try {
    const { group_id } = req.query;
    console.log(group_id);

    let listGroup;

    if (group_id != undefined) {
      listGroup = await Group.find({ _id: group_id }).sort('created');
    } else {
      listGroup = await Group.find({}).sort('created');
    }

    res.status(statusCode.OK).json({ listGroup });
  } catch (error) {
    logger.error(`GET /api/v1/group ${error}`);

    res.status(statusCode.BAD_REQUEST).json({
      error: 'Bad Request',
    });
  }
}

export async function CreateGroup(req, res) {
  try {
    let id;
    let check = true;
    // create group_id
    while (check) {
      id = '-' + makeid(19).toString();
      let temp = await Group.findOne({ _id: id });
      console.log({ temp });
      if (!temp) check = false;
    }
    // create new group
    console.log('create');
    const avatarGroup = req.body.avatarGroup;
    const description = req.body.description;
    const nameGroup = req.body.nameGroup;
    const members = req.body.members;
    const user_id = req.query.user_id;
    console.log(user_id)

    const group1 = new Group({
      _id: id,
      id_user: user_id,
      avatarGroup: avatarGroup,
      description: description,
      members: members,
      nameGroup: nameGroup
    });

    await group1.save();

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

    res.status(statusCode.OK).json({ group1 });
  } catch (error) {
    logger.error(`POST /api/v1/group ${error}`);

    res.status(statusCode.BAD_REQUEST).json({
      error: 'Bad Request',
    });
  }
}

export async function AddUserToGroup(req, res) {
  try {
    const group_id = req.query.group_id;
    const member = req.body

    if (group_id != undefined) {
      Group.findOneAndUpdate(
        { _id: group_id },
        { $push: { members: member } },
        { new: true }, (err, result) => {

        }
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

export async function DeleteUserInGroup(req, res) {
  try {
    const group_id = req.query.group_id;
    const user_id = req.query.user_id;
    const member_id = req.query.member_id;
    if (group_id != undefined && user_id != undefined && member_id != undefined) {
      const group = await Group.findOne({ _id: group_id }).exec()
      if (user_id == group.id_user) {
        // delete user in group
        Group.update({ _id: group_id, id_user: user_id }, { "$pull": { "members": { "id": member_id } } }, { safe: true, multi: true }, function (err, obj) {
        });
      }
      else {
        res.status(statusCode.BAD_REQUEST).json({
          error: 'you cannot delete',
        })
        return
      }
    }
    else {
      res.status(statusCode.BAD_REQUEST).json({
        error: 'you cannot delete',
      })
      return
    }

    res.status(statusCode.OK).json({ member_id: member_id });
  } catch (error) {
    logger.error(`Delete /api/v1/group ${error}`);

    res.status(statusCode.BAD_REQUEST).json({
      error: 'Bad Request',
    });
  }
}

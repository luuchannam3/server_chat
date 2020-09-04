// import Group from '../models/group';
import statusCode from '../constant/statusCode';
import logger from '../config/winston';
import Group from '../models/group';
import user from '../models/user';

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
    while (check) {
      id = '-' + makeid(19).toString();
      let temp = await Group.findOne({ _id: id });
      console.log({ temp });
      if (!temp) check = false;
    }

    console.log('create');
    const avatarGroup = req.body.avatarGroup;
    const created = req.body.created || Date.now();
    const description = req.body.description;
    const nameGroup = req.body.nameGroup;
    const members = req.body.members;
    const user_id = req.query.user_id;

    const group1 = new Group({
      _id: id,
      avatarGroup: avatarGroup,
      created: created,
      description: description,
      // admin: admin,
      members: members,
      nameGroup: nameGroup,
      id_user: user_id,
    });

    await group1.save();

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
    const user_id = req.query.user_id;

    let group = await Group.findOne({
      $and: [{ _id: group_id }, { id_user: user_id }],
    });

    if (!group)
      res.status(statusCode.BAD_REQUEST).json({
        error: 'You cannot add',
      });

    const member = req.body.member;
    group.members.push(member);

    await group.save();

    res.status(statusCode.OK).json(group);
  } catch (error) {
    logger.error(`GET /api/v1/group ${error}`);

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

    let group = await Group.findOne({
      $and: [{ _id: group_id }, { id_user: user_id }],
    });

    if (!group)
      res.status(statusCode.BAD_REQUEST).json({
        error: 'You cannot delete',
      });

    const removeIndex = group.members
      .map((member) => member.id)
      .indexOf(member_id);
    group.members.splice(removeIndex, 1);

    await group.save();

    res.status(statusCode.OK).json(group.members);
  } catch (error) {
    logger.error(`GET /api/v1/group ${error}`);

    res.status(statusCode.BAD_REQUEST).json({
      error: 'Bad Request',
    });
  }
}

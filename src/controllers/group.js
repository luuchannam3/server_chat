// import Group from '../models/group';
import statusCode from '../constant/statusCode';
import logger from '../config/winston';
import Group from '../models/group';

export async function GetGroup(req, res) {
  try {
    const group_id = req.query.id;
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
    const _id = req.body._id;
    const avatarGroup = req.body.avatarGroup;
    const created = req.body.created || Date.now();
    const description = req.body.description;
    const nameGroup = req.body.nameGroup;
    const member = req.body.member;
    const user_id = req.query.user_id;
    // const admin=req.body.admin
    console.log(member);
    // console.log(typeof member)
    const group1 = new Group({
      avatarGroup: avatarGroup,
      created: created,
      description: description,
      // admin: admin,
      member: member,
      nameGroup: nameGroup,
      id_user: user_id,
      _id: _id,
    });
    await group1.save();
    console.log(group1);

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

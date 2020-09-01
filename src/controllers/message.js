// import Group from '../models/group';
import statusCode from '../constant/statusCode';
import logger from '../config/winston';
import message from '../models/message';
import user from '../models/user';

export async function GetMessage(req, res) {
  try {
    const { group_id } = req.query;
    console.log(group_id)

    let listMessage;

    if (group_id != undefined) {
      listMessage = await message.find({_id: group_id}).sort('create');
    } else {
      listMessage = await message.find({}).sort('create');
    }

    res.status(statusCode.OK).json({ listGroup });
  } catch (error) {
    logger.error(`GET /api/v1/group ${error}`);

    res.status(statusCode.BAD_REQUEST).json({
      error: 'Bad Request',
    });
  }
}

export async function AddMessage(req, res) {
  try {
    const avatarGroup = req.body.avatarGroup
    const created= req.body.created
    const description = req.body.description
    const nameGroup = req.body.nameGroup
    const member = req.body.member
    const user_id=req.query
    // const admin=req.body.admin
    console.log(member)
    // console.log(typeof member)
    const group1 = new group({
      _id: "2",
      avatarGroup: avatarGroup,
      created: created,
      description: description,
      // admin: admin,
      member: member,
      nameGroup: nameGroup
    })
    console.log(group1)
    group1.save(function (err) {
      // if (err) console.log(err)
      // saved!
    });
    
    res.status(statusCode.OK).json({ group1 });
  } catch (error) {
    logger.error(`POST /api/v1/group ${error}`);

    res.status(statusCode.BAD_REQUEST).json({
      error: 'Bad Request',
    });
  }
}

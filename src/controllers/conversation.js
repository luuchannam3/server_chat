// import Group from '../models/group';
import statusCode from '../constant/statusCode';
import logger from '../config/winston';
import conversation from '../models/conversation';
import user from '../models/user';

export async function GetConversation(req, res) {
  try {
    const user_id= req.query.user_id
    const page = req.query.page
    const row = req.query.row

    console.log(user_id)

    let listConversation;

    if (user_id != undefined) {
      listConversation = await conversation.find({}).sort('create');
    } else {
      listGroup = await conversation.find({}).sort('create');
    }

    res.status(statusCode.OK).json({ listConversation });
  } catch (error) {
    logger.error(`GET /api/v1/conversation ${error}`);

    res.status(statusCode.BAD_REQUEST).json({
      error: 'Bad Request',
    });
  }
}

export async function CreateGroup(req, res) {
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

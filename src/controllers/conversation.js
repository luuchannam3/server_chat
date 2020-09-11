// import Group from '../models/group';
import statusCode from '../constant/statusCode';
import logger from '../config/winston';
import conversation from '../models/conversation';
import user from '../models/user'

export async function GetConversation(req, res) {
  try {
    const user_id = req.query.user_id
    let page = req.query.page
    const conversation_id = req.query.conversation_id
    // Default Rows And Pages
    if (page === undefined) {
      page = 1;
    }

    // console.log(user_id)

    let listConversation;

    if (user_id != undefined && conversation_id === undefined) {
      listConversation = await conversation.find({ "members": user_id }).sort('updateAt').skip((page - 1) * 20).limit(20)
    } else if (conversation_id != undefined) {
      listConversation = await conversation.find({ _id: conversation_id }).sort('updateAt');
    }
    else{
      listConversation = await conversation.find({}).sort('updateAt')
    }
    res.status(statusCode.OK).json({ listConversation });
  } catch (error) {
    logger.error(`GET /api/v1/conversation ${error}`);

    res.status(statusCode.BAD_REQUEST).json({
      error: 'Bad Request',
    });
  }
}
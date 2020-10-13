import statusCode from '../constant/statusCode';
import logger from '../config/winston';
import conversation from '../models/conversation';

function GetConversation(req, res) {
  try {
    console.log(req.query)
    const user_id = req.query.user_id
    let page = req.query.page
    const conversation_id = req.query.conversation_id
    // Default Rows And Pages
    if (page === undefined) {
      page = 1;
    }
    // console.log(user_id)

    // let listConversation;
    // console.log(listConversation)
    var query
    if (user_id != undefined && conversation_id === undefined) {
      // listConversation = conversation.find({ "members": user_id }).sort('updateAt').skip((page - 1) * 20).limit(20)
      query = conversation.find({members: user_id}).sort('updateAt').skip((page - 1) * 20).limit(20);
      query.exec((err, listConversation) => {
        if(err) res.send(err);
        res.status(statusCode.OK).json({listConversation});
      });
    } else if (conversation_id != undefined) {
      // listConversation = conversation.find({ _id: conversation_id }).sort('updateAt');
      query = conversation.find({ _id: conversation_id}).sort('updateAt');
      query.exec((err, listConversation) => {
        if(err) res.send(err);
        res.status(statusCode.OK).json({listConversation});
      });
    }
    else{
      // listConversation = conversation.find({}).sort('updateAt');
      query = conversation.find({}).sort('updateAt');
      query.exec((err, listConversation) => {
        if(err) res.send(err);
        res.status(statusCode.OK).json({listConversation});
      });
    }
    // console.log(listConversation)
    // return res.status(statusCode.OK).json({ listConversation });
  } catch (error) {
    logger.error(`GET /api/v1/conversation ${error}`);

    res.status(statusCode.BAD_REQUEST).json({
      error: 'Bad Request',
    });
  }
}
export default {GetConversation};
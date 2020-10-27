import statusCode from '../constant/statusCode';
import logger from '../config/winston';
import conversation from '../models/conversation';

function GetConversation(req, res) {
  try {
    const userId = req.query.userId;
    let page = req.query.page;
    const conversationId = req.query.conversationId;
    // Default Rows And Pages
    if (page === undefined) {
      page = 1;
    }
    let query;
    if (userId != undefined && conversationId === undefined) {
      query = conversation.find({members: userId}).sort('updateAt').skip((page - 1) * 20).limit(20);
      query.exec((err, listConversation) => {
        if(err) res.send(err);
        res.status(statusCode.OK).json({listConversation});
      });
    } else if (conversationId != undefined) {
      query = conversation.find({ _id: conversationId}).sort('updateAt');
      query.exec((err, listConversation) => {
        if(err) res.send(err);
        res.status(statusCode.OK).json({listConversation});
      });
    }
    else{
      query = conversation.find({}).sort('updateAt');
      query.exec((err, listConversation) => {
        if(err) res.send(err);
        res.status(statusCode.OK).json({listConversation});
      });
    }
  } catch (error) {
    logger.error(`GET /api/v1/conversation ${error}`);

    res.status(statusCode.BAD_REQUEST).json({
      error: 'Bad Request',
    });
  }
}
export default {GetConversation};
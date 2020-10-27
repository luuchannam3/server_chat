import statusCode from '../constant/statusCode';
import logger from '../config/winston';
import PrivateChat from '../models/private_chat';
import GroupChat from '../models/group_chat';

function distinguish(str) {
    let res = str.split('-');
    if (res.length != 2) return false;
    else {
        const str1 = res[0].substring(2, res[0].length);
        const str2 = res[1].substring(2, res[1].length);
        const reg = new RegExp(/^[0-9]*$/);
        if (reg.test(str1) == true && reg.test(str2) == true) return true;
        else return false;
    }
}
function PostMessage(req, res) {
    try {
        const id_sender = req.query.id_sender;
        const conversationId = req.query.conversationId;
        const page = req.query.page;
        if (id_sender != undefined && conversationId != undefined) {
            const result = distinguish(conversationId);
            let query;
            if (result == true) {
                query = PrivateChat.find({id_Conversation: conversationId}).sort('time').skip((page - 1) * 20).limit(20 * page);
                query.exec((err, listMessage) => {
                  if(err) res.send(err);
                  res.render('index1', {id_sender: id_sender, conversationId:conversationId, listMessage: listMessage});
                });
            }
            else {
                query = GroupChat.find({id_Conversation: conversationId}).sort('time').skip((page - 1) * 20).limit(20 * page);
                query.exec((err, listMessage) => {
                  if(err) res.send(err);
                  res.render('index1', {id_sender: id_sender, conversationId:conversationId, listMessage: listMessage});
                });
            }
        }
    } catch (error) {
        logger.error(`GET /api/v1/message ${error}`);

        res.status(statusCode.BAD_REQUEST).json({
            error: 'Bad Request',
        });
    }
}
function GetMessage(req, res) {
    try {
        const id_sender = req.query.id_sender;
        const conversationId = req.query.conversationId;
        const page = req.query.page;
        if (id_sender != undefined && conversationId != undefined) {
            const result = distinguish(conversationId);
            let query;
            if (result == true) {
                query = PrivateChat.find({id_Conversation: conversationId}).sort('time').skip((page - 1) * 20).limit(20 * page);
                query.exec((err, listMessage) => {
                  if(err) res.send(err);
                    res.status(statusCode.OK).json({listMessage});
                });
            }
            else {
                query = GroupChat.find({id_Conversation: conversationId}).sort('time').skip((page - 1) * 20).limit(20 * page);
                query.exec((err, listMessage) => {
                  if(err) res.send(err);
                  res.status(statusCode.OK).json({listMessage});
                });
            }
        }
    } catch (error) {
        logger.error(`GET /api/v1/message ${error}`);

        res.status(statusCode.BAD_REQUEST).json({
            error: 'Bad Request',
        });
    }
}
export default {PostMessage, GetMessage};
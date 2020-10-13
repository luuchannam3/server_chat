// import Group from '../models/group';
import statusCode from '../constant/statusCode';
import logger from '../config/winston';
import Friend from '../models/friend';
import Conversation from '../models/conversation'
import Private_Chat from '../models/private_chat'
import Group_Chat from '../models/group_chat'
import type from '../models/type'
import kafka from 'kafka-node'

function distinguish(str) {
    var res = str.split('-')
    if (res.length != 2) return false
    else {
        var str1 = res[0].substring(2, res[0].length)
        var str2 = res[1].substring(2, res[1].length)
        var reg = new RegExp(/^[0-9]*$/)
        if (reg.test(str1) == true && reg.test(str2) == true) return true
        else return false
    }
}
function PostMessage(req, res) {
    try {
        const id_sender = req.query.id_sender
        const conversation_id = req.query.conversation_id
        const page = req.query.page
        let listMessage;
        console.log(conversation_id)
        if (id_sender != undefined && conversation_id != undefined) {
            var result = distinguish(conversation_id)
            var query
            if (result == true) {
                // listMessage = await Private_Chat.find({id_Conversation: conversation_id}).sort('time').skip((page - 1) * 20).limit(20 * page)
                query = Private_Chat.find({id_Conversation: conversation_id}).sort('time').skip((page - 1) * 20).limit(20 * page);
                query.exec((err, listMessage) => {
                  if(err) res.send(err);
                  res.render('index1',{id_sender: id_sender,conversation_id:conversation_id, listMessage: listMessage});
                });
            }
            else {
                // listMessage = await Group_Chat.find({id_Conversation: conversation_id}).sort('time').skip((page - 1) * 20).limit(20 * page)
                query = Group_Chat.find({id_Conversation: conversation_id}).sort('time').skip((page - 1) * 20).limit(20 * page);
                query.exec((err, listMessage) => {
                  if(err) res.send(err);
                  res.render('index1',{id_sender: id_sender,conversation_id:conversation_id, listMessage: listMessage});
                });
            }
        }
        // res.render('index1',{id_sender: id_sender,conversation_id:conversation_id, listMessage: listMessage});
    } catch (error) {
        logger.error(`GET /api/v1/message ${error}`);

        res.status(statusCode.BAD_REQUEST).json({
            error: 'Bad Request',
        });
    }
}
function GetMessage(req, res) {
    try {
        const id_sender = req.query.id_sender
        const conversation_id = req.query.conversation_id
        const page = req.query.page
        let listMessage;
        console.log(conversation_id)
        if (id_sender != undefined && conversation_id != undefined) {
            var result = distinguish(conversation_id)
            var query
            if (result == true) {
                query = Private_Chat.find({id_Conversation: conversation_id}).sort('time').skip((page - 1) * 20).limit(20 * page);
                query.exec((err, listMessage) => {
                  if(err) res.send(err);
                    res.status(statusCode.OK).json({listMessage})
                //   res.render('index1',{id_sender: id_sender,conversation_id:conversation_id, listMessage: listMessage});
                });
            }
            else {
                query = Group_Chat.find({id_Conversation: conversation_id}).sort('time').skip((page - 1) * 20).limit(20 * page);
                query.exec((err, listMessage) => {
                  if(err) res.send(err);
                  res.status(statusCode.OK).json({listMessage})
                //   res.render('index1',{id_sender: id_sender,conversation_id:conversation_id, listMessage: listMessage});
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
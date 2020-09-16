// import Group from '../models/group';
import statusCode from '../constant/statusCode';
import logger from '../config/winston';
import Friend from '../models/friend';
import user from '../models/user';
import Conversation from '../models/conversation'
import Private_Chat from '../models/private_chat'
import Group_Chat from '../models/group_chat'

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

export async function GetMessage(req, res) {
    try {
        const user_id = req.query.user_id
        const conversation_id = req.query.conversation_id
        const page = req.query.page

        let listMessage;

        if (user_id != undefined && conversation_id != undefined) {
            var result = distinguish(conversation_id)
            if(result==true){
                listMessage = await Private_Chat.find({}).sort('time').skip((page - 1) * 20).limit(20*page)
            }
            else{
                listMessage = await Group_Chat.find({}).sort('time').skip((page - 1) * 20).limit(20*page)
            }
            
        }
        res.status(statusCode.OK).json({ listMessage });
    } catch (error) {
        logger.error(`GET /api/v1/message ${error}`);

        res.status(statusCode.BAD_REQUEST).json({
            error: 'Bad Request',
        });
    }
}


export async function AddMessage(req, res) {
    try {
        const user_id = req.query.user_id
        const conversation_id = req.query.conversation_id
        const Content = req.body.Content
        const isImage = req.body.isImage
        // distinguish group_chat or private_chat
        let chat
        if (conversation_id != undefined) {
            var result = distinguish(conversation_id)
            // result == true - private_chat
            // result ==false - group_chat
            
            if (result == true) {

                chat = new Private_Chat({
                    id_Conversation: conversation_id,
                    Content: Content,
                    isImage: isImage,
                    isSender: user_id
                });

                await chat.save();
            }
            // group_chat
            else {

                chat = new Group_Chat({
                    id_Conversation: conversation_id,
                    Content: Content,
                    isImage: isImage,
                    isSender: user_id
                });

                await chat.save();
            }
        }

        res.status(statusCode.OK).json({ chat })
    } catch (error) {
        logger.error(`POST /api/v1/message ${error}`);

        res.status(statusCode.BAD_REQUEST).json({
            error: 'Bad Request',
        });
    }
}

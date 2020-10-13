// import Group from '../models/group';
import statusCode from '../constant/statusCode';
import logger from '../config/winston';
import Friend from '../models/friend';
import user from '../models/user';
import Conversation from '../models/conversation'
import Private_Chat from '../models/private_chat'

function GetFriend(req, res) {
  try {
    const user_id = req.query.user_id
    var query
    if (user_id != undefined) {
      query = Friend.find({_id: user_id});
      query.exec((err, friends) => {
        if(err) res.send(err);
        res.status(statusCode.OK).json({friends});
      });
      // console.log(query)
    } else {
      query = Friend.find({});
      query.exec((err, friends) => {
        if(err) res.send(err);
        res.status(statusCode.OK).json({friends});
      });
      // console.log(query)
    }
    // res.status(statusCode.OK).json(query);
  } catch (error) {
    logger.error(`GET /api/v1/friend ${error}`);

    res.status(statusCode.BAD_REQUEST).json({
      error: 'Bad Request',
    });
  }
}

function AddFriend(req, res) {
  try {
    const user_id = req.query.user_id
    const friend_id = req.query.friend_id
    const adress = req.body.adress
    const imageurl = req.body.imageurl
    const username = req.body.username
    const friend1 = {
      _id: friend_id,
      adress: adress,
      imageurl: imageurl,
      username: username
    }
    // add friend
    if (user_id != undefined && friend_id != undefined) {
      Friend.findOneAndUpdate(
        { _id: user_id },
        { $push: { friend: { _id: friend_id, adress: adress, imageurl: imageurl, username: username } } },
        { new: true }, (err, result) => {

        }
      )
      // create conversationId
      var conversationId = ''
      var id1 = '', id2 = ''
      if (parseInt(user_id) > parseInt(friend_id)) {
        conversationId = `${friend_id}-${user_id}`
        id1 = friend_id
        id2 = user_id
      }
      else {
        conversationId = `${user_id}-${friend_id}`
        id1 = user_id
        id2 = friend_id
      }
      // create new converesation
      const conversation = new Conversation({
        _id: conversationId,
        lm: `Xin chào ${friend1.username}`,
        url: '',
        type: 0,
        name: '',
        listviewer: [],
        members: [id1, id2],
      })
      conversation.save((err) => {
        if (err) console.log(err)
      })
      // add message
      const message = new Private_Chat({
        id_Conversation: conversationId,
        Content: `Xin chào ${friend1.username}`,
        isImage: false,
        isSender: user_id
      })
      message.save((err) => {
        if (err) console.log(err)
      })
    }
    console.log(friend1)
    res.status(statusCode.OK).json({ friend1 });
  } catch (error) {
    logger.error(`POST /api/v1/friend ${error}`);

    res.status(statusCode.BAD_REQUEST).json({
      error: 'Bad Request',
    });
  }
}

function DeleteFriend(req, res) {
  try {
    const user_id = req.query.user_id
    const friend_id = req.query.friend_id
    console.log(user_id)
    console.log(friend_id)

    if (user_id != undefined && friend_id != undefined) {
      // delete friend
      Friend.updateOne({ _id: user_id }, { "$pull": { "friend": { "_id": friend_id } } }, { safe: true, multi: true }, function (err, obj) {
      });
      //get conversationid
      var conversationId = ''
      var id1 = '', id2 = ''
      if (parseInt(user_id) > parseInt(friend_id)) {
        conversationId = `${friend_id}-${user_id}`
        id1 = friend_id
        id2 = user_id
      }
      else {
        conversationId = `${user_id}-${friend_id}`
        id1 = user_id
        id2 = friend_id
      }
      // delete conversation
      Conversation.deleteOne({ _id: conversationId }, (err) => {

      })
      // delete message
      Private_Chat.deleteOne({ id_Conversation: conversationId }, (err) => {

      })
    }

    res.status(statusCode.OK).json({ friend_id });
  } catch (error) {
    logger.error(`POST /api/v1/friend ${error}`);

    res.status(statusCode.BAD_REQUEST).json({
      error: 'Bad Request',
    });
  }
}
export default {GetFriend, AddFriend, DeleteFriend};
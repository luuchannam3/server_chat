// import Group from '../models/group';
import statusCode from '../constant/statusCode';
import logger from '../config/winston';
import Friend from '../models/friend';
import Conversation from '../models/conversation';
import privateChat from '../models/private_chat';

function GetFriend(req, res) {
  try {
    const userId = req.query.userId;
    let query;
    if (userId != undefined) {
      query = Friend.find({_id: userId});
      query.exec((err, friends) => {
        if(err) res.send(err);
        res.status(statusCode.OK).json({friends});
      });
    } else {
      query = Friend.find({});
      query.exec((err, friends) => {
        if(err) res.send(err);
        res.status(statusCode.OK).json({friends});
      });
    }
  } catch (error) {
    logger.error(`GET /api/v1/friend ${error}`);

    res.status(statusCode.BAD_REQUEST).json({
      error: 'Bad Request',
    });
  }
}

function AddFriend(req, res) {
  try {
    const userId = req.query.userId;
    const friendId = req.query.friendId;
    const adress = req.body.adress;
    const imageurl = req.body.imageurl;
    const username = req.body.username;
    const friend1 = {
      _id: friendId,
      adress: adress,
      imageurl: imageurl,
      username: username
    };
    // add friend
    if (userId != undefined && friendId != undefined) {
      Friend.findOneAndUpdate(
        { _id: userId },
        { $push: { friend: { _id: friendId, adress: adress, imageurl: imageurl, username: username } } },
        { new: true }, (err, result) => {
          if(err) console.log(err);
          console.log(result);
        }
      );
      // create conversationId
      let conversationId = '';
      let id1 = '', id2 = '';
      if (parseInt(userId) > parseInt(friendId)) {
        conversationId = `${friendId}-${userId}`;
        id1 = friendId;
        id2 = userId;
      }
      else {
        conversationId = `${userId}-${friendId}`;
        id1 = userId;
        id2 = friendId;
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
      });
      conversation.save((err) => {
        if (err) console.log(err);
      });
      // add message
      const message = new privateChat({
        id_Conversation: conversationId,
        Content: `Xin chào ${friend1.username}`,
        isImage: false,
        isSender: userId
      });
      message.save((err) => {
        if (err) console.log(err);
      });
    }
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
    const userId = req.query.userId;
    const friendId = req.query.friendId;

    if (userId != undefined && friendId != undefined) {
      // delete friend
      Friend.updateOne({ _id: userId }, { "$pull": { "friend": { "_id": friendId } } }, { safe: true, multi: true }, function (err, obj) {
        if(err) throw err;
        console.log(obj);
      });
      //get conversationid
      let conversationId = '';
      if (parseInt(userId) > parseInt(friendId)) {
        conversationId = `${friendId}-${userId}`;
      }
      else {
        conversationId = `${userId}-${friendId}`;
      }
      // delete conversation
      Conversation.deleteOne({ _id: conversationId }, (err) => {
        if(err) throw err;
      });
      // delete message
      privateChat.deleteOne({ id_Conversation: conversationId }, (err) => {
        if(err) throw err;
      });
    }

    res.status(statusCode.OK).json({ friendId });
  } catch (error) {
    logger.error(`POST /api/v1/friend ${error}`);

    res.status(statusCode.BAD_REQUEST).json({
      error: 'Bad Request',
    });
  }
}
export default {GetFriend, AddFriend, DeleteFriend};
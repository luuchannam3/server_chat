import statusCode from '../constant/statusCode';
import logger from '../config/winston';
import multer from 'multer';
import Conversation from '../models/conversation';
import Group from '../models/group';

function UploadImage(req, res) {
  try {
    res.header('Content-Type', 'application/javascript');
    const conversationId = req.query.conversationId;
    let filename, path;

    const diskStorage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, '././public/group/');
      },
      filename: (req, file, cb) => {
        const math = ["image/png", "image/jpeg"];
        if (math.indexOf(file.mimetype) === -1) {
          res.status(statusCode.BAD_REQUEST).json({ 
            error: "The file is invalid"
          });
          return;
        }
        filename = `${Date.now()}-${conversationId}`;
        cb(null, filename);
      }
    });
    var uploadFile = multer({ storage: diskStorage }).single("name");

    uploadFile(req, res, (error) => {
      if (error) {
        console.log(error);
      }

      res.status(statusCode.OK).json(
        req.file
      );
      path=req.file.path;
      
      Conversation.findOne({ _id: conversationId }, function (err, doc) {
        doc.url = path;
        doc.save();
      });

      Group.findOne({ _id: conversationId }, function (err, doc) {
        doc.avatarGroup = path;
        doc.save();
      });
    });
  } catch (error) {
    logger.error(`Post /api/v1/avatargroup ${error}`);
    res.status(statusCode.BAD_REQUEST).json({
      error: 'Bad Request',
    });
  }
}
export default {UploadImage};
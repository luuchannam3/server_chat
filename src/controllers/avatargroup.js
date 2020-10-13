import statusCode from '../constant/statusCode';
import logger from '../config/winston';
import multer from 'multer'
import Conversation from '../models/conversation'
import Group from '../models/group'
function UploadImage(req, res) {
  try {
    res.header('Content-Type', 'application/javascript');
    const conversation_id = req.query.conversation_id
    var filename,path
    var diskStorage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, '././public/group/');
      },
      filename: (req, file, cb) => {
        var math = ["image/png", "image/jpeg"];
        console.log(file)
        if (math.indexOf(file.mimetype) === -1) {
          res.status(statusCode.BAD_REQUEST).json({ 
            error: "The file is invalid"
          })
          return;
        }

        filename = `${Date.now()}-${conversation_id}`;
        cb(null, filename);
      }
    });
    var uploadFile = multer({ storage: diskStorage }).single("name");

    uploadFile(req, res, (error) => {
      if (error) {
        console.log(error)
      }

      res.status(statusCode.OK).json(
        req.file
      );
      path=req.file.path
      // console.log(path)
      Conversation.findOne({ _id: conversation_id }, function (err, doc) {
        doc.url = path
        doc.save();
      });
      Group.findOne({ _id: conversation_id }, function (err, doc) {
        doc.avatarGroup = path
        doc.save();
      });
    });
  } catch (error) {
    logger.error(`Post /api/v1/avatargroup ${error}`);

    res.status(statusCode.BAD_REQUEST).json({
      error: 'Bad Request',
    });
  }
};
export default {UploadImage};
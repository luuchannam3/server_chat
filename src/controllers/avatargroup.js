import statusCode from '../constant/statusCode';
import logger from '../config/winston';
import multer from 'multer'
import Conversation from '../models/conversation'
var filename, originalname, encoding, mimetype, destination, path, size
export async function UploadImage(req, res) {
  try {
    const conversation_id = req.query.conversation_id
    var diskStorage = multer.diskStorage({
      destination: (req, file, callback) => {
        callback(null, "public/group");
      },
      filename: (req, file, callback) => {
        var math = ["image/png", "image/jpeg"];
        if (math.indexOf(file.mimetype) === -1) {
          var errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
          return callback(errorMess, null);
        }

        filename = `${Date.now()}-${conversation_id}`;
        callback(null, filename);
      }
    });
    var uploadFile = multer({ storage: diskStorage }).single("file");

    uploadFile(req, res, (error) => {
      if (error) {
        console.log(error)
      }

      filename = req.file.filename
      originalname = req.file.originalname
      encoding = req.file.encoding
      mimetype = req.file.mimetype
      destination = req.file.destination
      path = req.file.path
      size = req.file.size
      console.log(path)

      Conversation.findOne({ _id: conversation_id }, function (err, doc) {
        doc.url = path
        doc.save();
      });
    });
    const file = req.body.file
    console.log(req.body)
    res.status(statusCode.OK).json({
      file: file,
      filename: filename,
      originalname: originalname,
      encoding: encoding,
      path: path,
      size: size,
      mimetype: mimetype,
      destination: destination
    });
  } catch (error) {
    logger.error(`Post /api/v1/avatargroup ${error}`);

    res.status(statusCode.BAD_REQUEST).json({
      error: 'Bad Request',
    });
  }
}

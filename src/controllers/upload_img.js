import multer from 'multer';
import path from 'path';
import statusCode from '../constant/statusCode';
import logger from '../config/winston';

function UploadImage(req, res) {
  try {
    const diskStorage = multer.diskStorage({
      destination: (_req, _file, cb) => {
        cb(null, '././public/upload/');
      },
      // eslint-disable-next-line consistent-return
      filename: (_req, file, cb) => {
        const math = ['image/png', 'image/jpeg'];

        if (math.indexOf(file.mimetype) === -1) {
          return res.status(statusCode.BAD_REQUEST).json({
            error: 'The file is invalid',
          });
        }

        const filename = `${Date.now()}${path.extname(file.originalname)}`;
        cb(null, filename);
      },
    });

    const uploadFile = multer({ storage: diskStorage }).single('name');

    uploadFile(req, res, async (error) => {
      if (error) {
        console.log(error);
      }

      const { filename } = req.file;

      return res.status(statusCode.OK).json({
        filename,
      });
    });
  } catch (error) {
    logger.error(`Post /api/v1/upload_img ${error}`);

    res.status(statusCode.BAD_REQUEST).json({
      error: 'Bad Request',
    });
  }
}

export default { UploadImage };

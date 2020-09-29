import express from 'express';
import multer from 'multer'
import * as AvatarGroupController from '../../../controllers/avatargroup';
const router = express.Router();

router.post('/', AvatarGroupController.UploadImage);

export default router;
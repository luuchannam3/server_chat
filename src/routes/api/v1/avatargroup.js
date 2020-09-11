import express from 'express';
import * as AvatarGroupController from '../../../controllers/avatargroup';
const router = express.Router();

router.post('/', AvatarGroupController.UploadImage);

router.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

export default router;
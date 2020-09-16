import express from 'express';
import * as MessageController from '../../../controllers/message';
import user from '../../../models/user';

const router = express.Router();
console.log("asasas")
// GET /api/v1/group?user_id=?
// get user's group
router.get('/', MessageController.GetMessage);
// create new group
router.post('/', MessageController.AddMessage);

export default router;

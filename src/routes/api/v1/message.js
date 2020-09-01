import express from 'express';
import * as MessageController from '../../../controllers/message';
import user from '../../../models/user';

const router = express.Router();

// GET /api/v1/group?user_id=?
// get user's group
router.get('/', MessageController.GetMessage);
// delete user in group
// router.delete('/',GroupController)
// create new group 
router.post('/', MessageController.AddMessage);
// add new user to group
// router.put('/',GroupController)

export default router;

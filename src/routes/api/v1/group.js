import express from 'express';
import * as GroupController from '../../../controllers/group';
import user from '../../../models/user';

const router = express.Router();

// GET /api/v1/group?user_id=?
// get user's group
router.get('/', GroupController.GetGroup);
// delete user in group
router.delete('/', GroupController.DeleteUserInGroup);

// create new group
router.post('/', GroupController.CreateGroup);

// add new user to group
router.put('/', GroupController.AddUserToGroup);

export default router;

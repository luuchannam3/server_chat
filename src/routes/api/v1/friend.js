import express from 'express';
import * as FriendController from '../../../controllers/friend';
import user from '../../../models/user';

const router = express.Router();
// GET /api/v1/group?user_id=?
// get list friend
router.get('/', FriendController.GetFriend);
// delete 1 friend in list friend
router.delete('/', FriendController.DeleteFriend);
// add friend
router.post('/',FriendController.AddFriend)


export default router;

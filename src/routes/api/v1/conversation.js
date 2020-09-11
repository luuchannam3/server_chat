import express from 'express';
import * as ConversationController from '../../../controllers/conversation';
import user from '../../../models/user';

const router = express.Router();

// GET /api/v1/group?user_id=?
// get user's group
router.get('/', ConversationController.GetConversation);

export default router;

import express from 'express';
import ConversationController from '../controllers/conversation';

export const ConversationRoutes = express.Router();

// GET /api/v1/conversation
ConversationRoutes.get('/', ConversationController.GetConversation);

import express from 'express';
import MessageController from '../controllers/message';

export const MessageRoutes = express.Router();

// GET /api/v1/message
MessageRoutes.get('/', MessageController.GetMessage);

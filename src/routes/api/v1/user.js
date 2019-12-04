import express from 'express';
import * as UserController from '../../../controllers/user';

const router = express.Router();

// GET /api/v1/user?page=1&rows=20&q=
// GET List User
router.get('/', UserController.GetUser);

// POST /api/v1/user
// Create new user
router.post('/', UserController.CreateUser);

export default router;

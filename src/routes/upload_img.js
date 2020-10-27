import express from 'express';
import UploadImgController from '../controllers/upload_img';

export const UploadImgRoutes = express.Router();

// POST /api/v1/upload_img
UploadImgRoutes.post('/', UploadImgController.UploadImage);

import express from 'express';
import { uploadVideo } from '../controllers/video.controller';
import { isAuth } from '../middlewares/isAuth.middleware.js';

const videoRouter = express.Router();

videoRouter.post('/upload' , isAuth , uploadVideo)


export default videoRouter
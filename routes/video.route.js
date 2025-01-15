import express from 'express';
import { updateVideo, uploadVideo } from '../controllers/video.controller.js';
import { isAuth } from '../middlewares/isAuth.middleware.js';

const videoRouter = express.Router();

videoRouter.post('/upload', isAuth, uploadVideo)
videoRouter.put('/update/:videoId', isAuth, updateVideo)


export default videoRouter
import express from 'express';
import { deleteVideo, dislikeVideo, likeVideo, updateVideo, uploadVideo, viewsOfVideo } from '../controllers/video.controller.js';
import { isAuth } from '../middlewares/isAuth.middleware.js';

const videoRouter = express.Router();

videoRouter.post('/upload', isAuth, uploadVideo)
videoRouter.put('/update/:videoId', isAuth, updateVideo)
videoRouter.delete('/delete/:videoId', isAuth, deleteVideo)
videoRouter.put('/like/:videoId', isAuth, likeVideo)
videoRouter.put('/dislike/:videoId', isAuth, dislikeVideo)
videoRouter.put('/views/:videoId', viewsOfVideo)


export default videoRouter
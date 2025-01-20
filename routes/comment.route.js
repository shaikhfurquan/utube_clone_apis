import express from 'express';
import { isAuth } from '../middlewares/isAuth.middleware.js';
import { getAllCommentsOnVideo, newComment } from '../controllers/comment.controller.js';

const commentRouter = express.Router();

commentRouter.post('/new-comment/:videoId', isAuth , newComment)
commentRouter.get('/comments/:videoId', isAuth , getAllCommentsOnVideo)


export default commentRouter
import express from 'express';
import { isAuth } from '../middlewares/isAuth.middleware.js';
import { newComment } from '../controllers/comment.controller.js';

const commentRouter = express.Router();

commentRouter.post('/new-comment/:videoId', isAuth , newComment)


export default commentRouter
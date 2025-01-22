import express from 'express';
import { isAuth } from '../middlewares/isAuth.middleware.js';
import { deleteComment, getAllCommentsOnVideo, newComment, updateComment } from '../controllers/comment.controller.js';

const commentRouter = express.Router();

commentRouter.post('/new-comment/:videoId', isAuth, newComment)
commentRouter.get('/comments/:videoId', isAuth, getAllCommentsOnVideo)
commentRouter.put('/update/:commentId', isAuth, updateComment)
commentRouter.delete('/delete/:commentId', isAuth, deleteComment)


export default commentRouter
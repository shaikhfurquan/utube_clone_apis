import express from 'express';
import { addToWatchHistory, getWatchHistory, loginUser, logoutUser, registerUser, removeFromWatchHistory, subscribeUser, unsubscribeUser, userProfile } from '../controllers/user.controller.js';
import { isAuth } from '../middlewares/isAuth.middleware.js';


const userRouter = express.Router();

userRouter.post('/login', loginUser)
userRouter.post('/register', registerUser)
userRouter.get('/profile', isAuth, userProfile)
userRouter.get('/logout', isAuth, logoutUser)
userRouter.put('/subscribe/:userBId', isAuth, subscribeUser)
userRouter.put('/unsubscribe/:userBId', isAuth, unsubscribeUser)
userRouter.post('/watch-history', isAuth, addToWatchHistory);       // add a video to watch history
userRouter.get('/watch-history', isAuth, getWatchHistory); // watch history for the authenticated user
userRouter.post('/clear-watch-history', isAuth, removeFromWatchHistory)

export default userRouter
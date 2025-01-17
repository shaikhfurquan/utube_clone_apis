import express from 'express';
import { loginUser, logoutUser, registerUser, subscribeUser, unsubscribeUser } from '../controllers/user.controller.js';
import { isAuth } from '../middlewares/isAuth.middleware.js';


const userRouter = express.Router();

userRouter.post('/login', loginUser)
userRouter.post('/register', registerUser)
userRouter.get('/logout', isAuth, logoutUser)
userRouter.put('/subscribe/:userBId', isAuth, subscribeUser)
userRouter.put('/unsubscribe/:userBId', isAuth, unsubscribeUser)

export default userRouter
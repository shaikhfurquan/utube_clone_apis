import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model.js';


export const isAuth = async (req, res, next) => {
    try {
        // console.log("isAuthUser");
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized, There is no token' });
        }


        // decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await UserModel.findById(decoded._id)
        req.user = user
        return next()

    } catch (error) {
        return next(error);
        // res.status(401).json({ message: "Error while authenticating the user", error: error.message })
    }
}

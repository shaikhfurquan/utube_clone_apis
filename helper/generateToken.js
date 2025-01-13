import jwt from 'jsonwebtoken';
export const generateToken =  (user) => {
    try {
        return jwt.sign({ _id: user._id, }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRESIN })
    } catch (error) {
        console.log(error.message);
    }
}
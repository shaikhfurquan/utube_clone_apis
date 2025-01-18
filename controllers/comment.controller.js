import UserModel from "../models/user.model.js";
import VideoModel from "../models/video.model.js";
import CommentModel from "../models/comment.model.js";


export const newComment = async (req, res, next) => {
    try {
        const newComment = new CommentModel({
            commentedByUserId: req.user._id,
            commentedOnvideoId: req.params.videoId,
            commentText: req.body.commentText
        })
        await newComment.save()
        res.status(201).json({
            message: "Commented on video",
            comment: newComment
        })
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid ID", error: error.message });
        }
        next(error);
    }
}
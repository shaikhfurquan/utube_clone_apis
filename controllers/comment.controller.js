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


// get all comments for any video
export const getAllCommentsOnVideo = async (req, res, next) => {
    try {
        const comments = await CommentModel.find({ videoId: req.params.videoId }).populate("commentedByUserId", "userName channelName logo.url")
        if (!comments) {
            return res.status(404).json({ message: "No comments found for this video" })
        }
        res.status(200).json({
            message: "Comments fetched successfully",
            commentsLists: comments
        })
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid ID", error: error.message });
        }
        next(error);
    }
}


export const updateComment = async (req, res, next) => {
    try {
        const comment = await CommentModel.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" })
        }
        // check the ownership of the comment
        if (comment.commentedByUserId.toString() != req.user._id.toString()) {
            return res.status(403).json({ message: "You are not allowed to update this comment" })
        }
        // update the comment
        comment.commentText = req.body.commentText
        await comment.save()
        res.status(200).json({
            message: "Comment updated successfully",
            updatedComment: comment
        })
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid ID", error: error.message });
        }
        next(error);
    }
}


export const deleteComment = async (req, res, next) => {
    try {
        const comment = await CommentModel.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" })
        }
        // check the ownership of the comment
        if (comment.commentedByUserId.toString() != req.user._id.toString()) {
            return res.status(403).json({ message: "You are not allowed to delete this comment" })
        }
        // delete the comment
        await CommentModel.findByIdAndDelete(req.params.commentId)
        res.status(200).json({
            message: "Comment deleted successfully"
        })
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid ID", error: error.message });
        }
        next(error);
    }
}

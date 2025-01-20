import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    commentedByUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    videoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    },
    commentText: {
        type: String,
        required: [true, "Comment Text is required"]
    }

}, { timestamps: true });

// Exporting the User model
const CommentModel = mongoose.model('Comment', commentSchema);

export default CommentModel;

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
    },
    description: {
        type: String,
        required: [true, 'Video description is required'],
    },
    uploadedByUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    video: {
        public_id: {
            type: String,
            required: [true, "Video ID is required"],
        },
        url: {
            type: String,
            required: [true, "Video URL is required"],
        },
    },
    thumbnail: {
        public_id: {
            type: String,
            required: [true, "Thumbnail ID is required"],
        },
        url: {
            type: String,
            required: [true, "Thumbnail URL is required"],
        },
    },
    category: {
        type: String,
        required: [true, "Category is required"]
    },
    tags: [{
        type: String
    }],
    likes: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    dislikedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    viewedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]

}, { timestamps: true });

// Exporting the User model
const VideoModel = mongoose.model('Vidoe', userSchema);

export default VideoModel;

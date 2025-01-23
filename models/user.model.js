import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

    userName: {
        type: String,
        required: [true, 'User name is required'],
        trim: true,
    },
    channelName: {
        type: String,
        required: [true, 'Channel name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        // unique: true, // Correct usage of unique
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
    },
    phone: {
        type: Number,
        required: [true, 'Phone number is required'],
        // unique: true, // Added unique constraint
    },
    logo: {
        public_id: {
            type: String,
            required: [true, "Logo ID is required"],
        },
        url: {
            type: String,
            required: [true, "Logo URL is required"],
        },
    },
    subscribers: {
        type: Number,
        default: 0,
    },
    subscribedByUserId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    subscribedChannels: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    watchHistory: [
        {
            videoId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Vidoe', // Assuming you have a Video model
                required: true,
            },
            watchedAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
}, { timestamps: true });

// Exporting the User model
const UserModel = mongoose.model('User', userSchema);

export default UserModel;

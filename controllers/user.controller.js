import cloudinary from "../config/cloudinary.config.js";
import UserModel from '../models/user.model.js'
import fs from 'fs'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import { generateToken } from "../helper/generateToken.js";


export const registerUser = async (req, res, next) => {
    try {
        // checking if the user already exists
        const existingUser = await UserModel.findOne({ email: req.body.email })
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' })
        }

        // validate the image
        if (!req.files || !req.files.logo) {
            return res.status(400).json({ message: "Image Logo is required" });
        }
        // upload the image
        const result = await cloudinary.uploader.upload(req.files.logo.tempFilePath)
        const logo = {
            public_id: result.public_id,
            url: result.secure_url
        }

        // Delete the image from the local temp folder
        fs.unlink(req.files.logo.tempFilePath, (err) => {
            if (err) {
                console.error("Error while deleting temp file:", err.message);
            }
        });

        // hashing the password
        const hashPassword = await bcrypt.hash(req.body.password, 10)

        const newUser = new UserModel({
            channelName: req.body.channelName,
            userName: req.body.userName,
            phone: req.body.phone,
            email: req.body.email,
            password: hashPassword,
            logo: logo
        })
        await newUser.save()
        res.status(201).json({
            messsage: "User signup successful",
            user: newUser
        })


    } catch (error) {
        // Handle duplicate email errors
        // if (error.code === 11000) {
        //     return res.status(409).json({ message: 'Email already exists' });
        // }
        next(error);
    }
}


export const loginUser = async (req, res, next) => {
    try {
        // checking if the user is there
        const user = await UserModel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(400).json({ message: 'User not found' })
        }


        // verify the password
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }
        user.password = undefined

        // token
        const token = generateToken(user)
        res.cookie("token", token).status(200).json({
            messsage: `Welcome ${user.userName}`,
            token,
            user,
        })


    } catch (error) {
        // Handle duplicate email errors
        // if (error.code === 11000) {
        //     return res.status(409).json({ message: 'Email already exists' });
        // }
        next(error);
    }
}


export const logoutUser = async (req, res, next) => {
    try {
        res.clearCookie('token').status(200).json({
            message: "Logout successfully",
            user: req.user
        })

    } catch (error) {
        next(error);
    }
}


export const subscribeUser = async (req, res, next) => {
    try {
        // Fetch both users in parallel
        const [userA, userB] = await Promise.all([
            UserModel.findById(req.user._id),           // The user subscribing
            UserModel.findById(req.params.userBId),     // The user being subscribed to
        ]);

        // Validate users
        if (!userA || !userB) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if userA is already subscribed to userB
        if (userB.subscribedByUserId.includes(req.user._id)) {
            return res.status(400).json({ message: "You are already subscribed to this user" });
        }

        // Increment the subscriber count for userB (the user being subscribed to).
        userB.subscribers += 1;

        // Add userA's ID (the subscriber) to userB's list of subscribers.
        userB.subscribedByUserId.push(req.user._id);

        // Add userB's ID (the user being subscribed to) to userA's list of subscribed channels.
        userA.subscribedChannels.push(req.params.userBId);

        // Save both users in parallel
        await Promise.all([userA.save(), userB.save()]);

        res.status(200).json({ message: "Subscribed successfully" });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid ID", error: error.message });
        }
        next(error);
    }
};


export const unsubscribeUser = async (req, res, next) => {
    try {
        // Fetch both users (userA is the unsubscribing user, userB is the user being unsubscribed from)
        const [userA, userB] = await Promise.all([
            UserModel.findById(req.user._id),        // Fetch the unsubscribing user (userA)
            UserModel.findById(req.params.userBId), // Fetch the user being unsubscribed from (userB)
        ]);

        // Validate that both users exist
        if (!userA || !userB) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if userA is actually subscribed to userB
        if (!userB.subscribedByUserId.includes(req.user._id)) {
            return res.status(400).json({ message: "You are not subscribed to this user" });
        }

        // // Remove userA's ID from userB's subscribedByUserId array
        userB.subscribers -= 1;
        userB.subscribedByUserId = userB.subscribedByUserId.filter(id => id.toString() != userA._id)

        // Remove userB's ID from userA's subscribedChannels array
        userA.subscribedChannels = userA.subscribedChannels.filter(id => id.toString() != userB._id)
        // Save both users in parallel
        await Promise.all([userA.save(), userB.save()]);

        res.status(200).json({ message: "Unsubscribed successfully" });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid ID", error: error.message });
        }
        next(error);
    }
};


// add a video to the user's watch history
export const addToWatchHistory = async (req, res, next) => {
    try {
        // Find the user and update their watch history
        const user = await UserModel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User  not found' });
        }

        // Check if the video is already in the watch history
        const existingEntry = user.watchHistory.find(entry => entry.videoId.toString() === req.body.videoId);
        if (existingEntry) {
            // If it exists, update the watchedAt timestamp
            existingEntry.watchedAt = Date.now();
        } else {
            // If it doesn't exist, add a new entry
            user.watchHistory.push({ videoId: req.body.videoId, watchedAt: Date.now() });
        }

        await user.save();
        return res.status(200).json({ success: true, message: 'Video added to watch history' });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid ID", error: error.message });
        }
        next(error);
    }
};


// get the user's watch history
export const getWatchHistory = async (req, res, next) => {
    try {
        // Find the user and populate the watchHistory.videoId
        const user = await UserModel.findById(req.user._id).populate({
            path: 'watchHistory.videoId', // Path to populate
            select: '_id title description video thumbnail category likes dislikes views', // Fields to include from Video model
        });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User  not found' });
        }

        return res.status(200).json({ success: true, watchHistory: user.watchHistory });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid ID", error: error.message });
        }
        next(error);
    }
};


// Remove a video from the user's watch history or clear the entire watch history
export const removeFromWatchHistory = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if the video exists in the user's watch history
        const videoToRemove = user.watchHistory.find(entry => entry.videoId.toString() === req.body.videoId);
        if (!videoToRemove) {
            return res.status(404).json({ success: false, message: 'Video not found in watch history' });
        }

        // // Check ownership
        if (req.user._id.toString() !== user._id.toString()) {
            return res.status(403).json({ success: false, message: 'You are not authorized to remove the video' });
        }

        // // Remove the video
        user.watchHistory = user.watchHistory.filter(entry => entry.videoId.toString() !== req.body.videoId);
        await user.save();

        return res.status(200).json({ success: true, message: 'Video removed from watch history' });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid ID', error: error.message });
        }
        next(error);
    }
};

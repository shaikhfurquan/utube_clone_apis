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
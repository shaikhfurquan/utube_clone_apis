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


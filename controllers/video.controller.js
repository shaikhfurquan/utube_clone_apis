import UserModel from "../models/user.model.js";
import VideoModel from "../models/video.model.js";
import cloudinary from "../config/cloudinary.config.js";
import fs from 'fs'


export const uploadVideo = async (req, res, next) => {
    try {
        // console.log("req.user" , req.user);
        // console.log("req.body" , req.body);
        // console.log("req.files" , req.files);

        // validate the image
        if (!req.files || !req.files.video || !req.files.thumbnail) {
            return res.status(400).json({ message: "video and thumbnail is required" });
        }
        // upload the image
        const uploadedVideo = await cloudinary.uploader.upload(req.files.video.tempFilePath , {
            resource_type: "video",
        })
        const uploadedThumbnail = await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath)

        const video = {
            public_id : uploadedVideo.public_id,
            url : uploadedVideo.secure_url,
        }
        const thumbnail = {
            public_id: uploadedThumbnail.public_id,
            url: uploadedThumbnail.secure_url
        }
        // console.log("video uploaded" , video);
        // console.log("thumbnail uploaded" , thumbnail);

        // Delete the image from the local temp folder
        fs.unlink(req.files.video.tempFilePath, (err) => {
            if (err) {
                console.error("Error while deleting temp file:", err.message);
            }
        });
        fs.unlink(req.files.thumbnail.tempFilePath, (err) => {
            if (err) {
                console.error("Error while deleting temp file:", err.message);
            }
        });

        const newVideo = new VideoModel({
            uploadedByUserId: req.user._id,
            title: req.body.title,
            description: req.body.description,
            video: video,
            thumbnail: thumbnail,
            tags : req.body.tags.split(","),   // become array
            category: req.body.category
        })
        await newVideo.save()

        res.status(201).json({
            message: "Video uploaded successfully",
            video: newVideo
        })


    } catch (error) {
        next(error);
    }
}
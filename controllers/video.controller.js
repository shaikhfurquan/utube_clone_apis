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
        const uploadedVideo = await cloudinary.uploader.upload(req.files.video.tempFilePath, {
            resource_type: "video",
        })
        const uploadedThumbnail = await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath)

        const video = {
            public_id: uploadedVideo.public_id,
            url: uploadedVideo.secure_url,
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
            tags: req.body.tags.split(","),   // become array
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


export const updateVideo = async (req, res, next) => {
    try {

        // Find the video and check ownership
        const video = await VideoModel.findById(req.params.videoId);
        if (!video) return res.status(404).json({ message: "Video not found" });
        if (String(video.uploadedByUserId) !== String(req.user._id)) {
            return res.status(403).json({ message: "You have no permission to update this video" });
        }

        // Prepare updated data
        const updatedData = {
            title: req.body.title,
            description: req.body.description,
            tags: req.body.tags?.split(','),
            category: req.body.category,
        };

        // Update thumbnail if a new file is provided
        if (req.files?.thumbnail) {
            // Remove old thumbnail
            await cloudinary.uploader.destroy(video.thumbnail.public_id);

            // Upload new thumbnail
            const uploadedThumbnail = await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath);

            updatedData.thumbnail = {
                public_id: uploadedThumbnail.public_id,
                url: uploadedThumbnail.secure_url,
            };

            // Clean up temporary file
            fs.unlink(req.files.thumbnail.tempFilePath, (err) => {
                if (err) console.error("Error deleting temp file:", err.message);
            });
        }

        // Update the video in the database
        const updatedVideo = await VideoModel.findByIdAndUpdate(req.params.videoId, updatedData, { new: true });

        res.status(200).json({
            message: "Video updated successfully",
            video: updatedVideo,
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid ID", error: error.message });
        }
        next(error);
    }
};


export const deleteVideo = async (req, res, next) => {
    try {

        // Find the video and check ownership
        const video = await VideoModel.findById(req.params.videoId);
        if (!video) return res.status(404).json({ message: "Video not found" });
        if (String(video.uploadedByUserId) !== String(req.user._id)) {
            return res.status(403).json({ message: "You have no permission to delete this video" });
        }

        // deleting the data sssociated with the video
        await cloudinary.uploader.destroy(video.thumbnail.public_id)
        await cloudinary.uploader.destroy(video.video.public_id, { resource_type: "video" })

        const deletedResponse = await VideoModel.findByIdAndDelete(req.params.videoId)
        res.status(200).json({
            message: "Video deleted successfully",
            deletedResponse
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid ID", error: error.message });
        }
        next(error);
    }
};

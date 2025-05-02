import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async(req, res) => {
    try {
        const loggedInUserId= req.body._id;
        const filteredUsers =await User.find({_id: {$ne: loggedInUserId}}).select("-password");
        res.status(200).json(filteredUsers);

    } catch (error) {
        console.error('erreur in getUsersForSidebar: ', error.message);
        res.status(500).json({error: 'internal server error'});
    }
}


export const getMessages = async(req, res) => {
    try {
        const {id: userToChatId} = req.params;
        const senderId =req.user._id;
        const messages = await Message.find({  // to  fnid all the messagess where i'm the receiver or i'm the sender ;
            $or:[
                {senderId: senderId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: senderId},
            ]
        })

        res.status(200).json(messages);
    } catch (error) {
        console.error('erreur in getMessages: ', error.message);
        res.status(500).json({error: 'internal server error'});
    }

}

export const sendMessages = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params; // Get receiverId from URL params
        const senderId = req.user._id; // Get senderId from authenticated user

        // Validate required fields
        if (!receiverId) {
            return res.status(400).json({ error: "Receiver ID is required" });
        }

        if (!text && !image) {
            return res.status(400).json({ error: "Message content cannot be empty" });
        }

        let imageUrl = null;

        // Handle image upload if present
        if (image) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(image, {
                    folder: "chat_images",
                    resource_type: "auto"
                });
                imageUrl = uploadResponse.secure_url;
            } catch (uploadError) {
                console.error("Cloudinary upload error:", uploadError);
                return res.status(500).json({ error: "Failed to upload image" });
            }
        }

        // Create new message document
        const newMessage = new Message({
            senderId,
            receiverId,
            text: text || null,
            image: imageUrl
        });

        // Save to database
        const savedMessage = await newMessage.save();

        // Return success response
        res.status(201).json({
            status: "success",
            message: "Message sent successfully",
            data: savedMessage
        });

    } catch (error) {
        console.error('Error in sendMessages:', error);

        // Handle specific Mongoose validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(el => el.message);
            return res.status(400).json({
                status: "fail",
                message: "Validation error",
                errors
            });
        }

        res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message
        });
    }
};
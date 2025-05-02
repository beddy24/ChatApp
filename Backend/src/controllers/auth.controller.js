import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const  signup = async (req, res) => {
    console.log("req.body =", req.body);

    try {
        const {fullName,email,password} = req.body;
        if(password.length < 6){
            return res.status(400).json({message: "password too short"});
        }

        const user = await User.findOne({email})

        //checking if the user already exists
        if (user) return res.status(400).json({message: "User already exists"});

        //hashing passwords using bcrypt package
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //creating the user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if(newUser){
            //generate jwt token
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullname,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })
        }else{
            res.status(400).json({message: "invalid User data"});
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({message: "internal server error"});
    }
};


export const  login = async (req, res)=>{
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email})

        if (!user ) {
            res.status(404).json({message: 'invalid credentials'});
        }

        const isCorrect = await bcrypt.compare(password, user.password);
        if (!isCorrect) {
            res.status(404).json({message: 'invalid password'});
        }

        generateToken(user._id,res);

        res.status(200).json({
            _id: user.id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,

        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({message: "internal server error"});
    }
};


export const  logout = (req, res)=>{
    try {
        res.cookie("jwt", "",{maxAge: 0});
        res.status(200).json({message: 'you are logged out'});
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({message: "internal server error"});
    }
};

export const updateProfile = async(req, res)=>{
    try {
        const {profilePic} =req.body;
        const userId = req.user._id;

        if(!profilePic){
            return res.status(400).json({message: "profile Picture is required!"})
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic:uploadResponse.secure_Url}, {new: true})

        res.status(200).json(updatedUser)
    } catch (error) {
        console.log("error in updating profile pic", error.message);
        res.status(500).json({message: "internal server error"});
    }
}

export const checkAuth = async(req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("error in checkAuth controlleer", error.message);
        res.status(500).json({message: "internal server error"});
    }
}

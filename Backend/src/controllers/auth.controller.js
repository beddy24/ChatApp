import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

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


export const  login = (req, res)=>{
    res.send("login route");
};


export const  logout = (req, res)=>{
    res.send("logout route");
};


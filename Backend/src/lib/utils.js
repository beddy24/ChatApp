import jwt from "jsonwebtoken"


export const generateToken = (UserID, res) => {
    const token = jwt.sign({userId: UserID}, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })
    res.cookie("jwt", token, {
        maxAge: 7*24*60*100, //MS
        httpOnly: true, //prevent XSS attacks cross-site scripiting attacks
        sameSite: "strict", //prevent CSRF attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development"
    })
    return token;
}
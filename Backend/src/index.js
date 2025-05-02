import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js"
import {connectDB} from "./lib/db.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ status: 'OK' });
    res.send('Hello, World! this is chatapp');
});

const PORT = 8080;

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`);
    connectDB()
});


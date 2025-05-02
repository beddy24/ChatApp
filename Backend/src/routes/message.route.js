import express from "express";
const router = express.Router();

import {getUsersForSidebar, getMessages, sendMessages} from '../controllers/message.controller.js';
import { protectRoute } from "../middleware/auth.middleware.js";

router.get('/users', protectRoute, getUsersForSidebar);
router.get('/:id/', protectRoute, getMessages);
router.post('/send/:id', protectRoute, sendMessages);
export default router;
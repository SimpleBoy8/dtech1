import express from "express";
import { saveMessage, getMessages } from "../controllers/chatController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, saveMessage);
router.get("/:userId/:adminId", protect, getMessages);

export default router;
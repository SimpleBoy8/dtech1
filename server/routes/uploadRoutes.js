import express from "express";
import upload from "../config/multer.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/file", protect, upload.single("file"), (req, res) => {
  res.json({
    fileUrl: `/uploads/files/${req.file.filename}`,
    fileName: req.file.originalname,
  });
});

router.post("/voice", protect, upload.single("voice"), (req, res) => {
  res.json({
    voiceUrl: `/uploads/voice/${req.file.filename}`,
  });
});

export default router;
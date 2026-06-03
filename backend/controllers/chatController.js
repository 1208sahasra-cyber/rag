// chatController.js - Handles /api/chat
import express from "express";
import { chatHandler } from "../services/searchService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message, history } = req.body;
    const response = await chatHandler(message, history);
    res.json(response);
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Chat processing failed" });
  }
});

export default router;

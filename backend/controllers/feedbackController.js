import express from "express";
import { logFeedback, getExemplars } from "../services/feedbackService.js";

const router = express.Router();

// POST /api/feedback
// Expected body: { question: string, answer: string, rating: number (1-5), correctedAnswer?: string }
router.post("/", async (req, res) => {
  try {
    const { question, answer, rating, correctedAnswer } = req.body;
    if (!question || !answer || typeof rating !== "number") {
      return res.status(400).json({ error: "Missing required fields" });
    }
    await logFeedback({ question, answer, rating, correctedAnswer });
    return res.json({ success: true });
  } catch (err) {
    console.error("Feedback error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/feedback/exemplars?question=...
// Returns top 2 exemplars for in‑context learning
router.get("/exemplars", async (req, res) => {
  try {
    const { question } = req.query;
    if (!question) {
      return res.status(400).json({ error: "Missing question query param" });
    }
    const exemplars = await getExemplars(question, 2);
    return res.json({ exemplars });
  } catch (err) {
    console.error("Exemplar fetch error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

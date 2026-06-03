// reindexController.js - Handles /api/reindex
import express from "express";
import { reindexDocuments } from "../services/parserService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const stats = await reindexDocuments();
    res.json({ success: true, stats });
  } catch (err) {
    console.error("Reindex error:", err);
    res.status(500).json({ error: "Reindex failed" });
  }
});

export default router;

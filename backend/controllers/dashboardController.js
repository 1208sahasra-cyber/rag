// backend/controllers/dashboardController.js
import express from "express";
import { getCollection } from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const docColl = await getCollection(process.env.CHROMADB_COLLECTION || "document_collection");
    const feedbackColl = await getCollection(process.env.CHROMADB_FEEDBACK_COLLECTION || "feedback_collection");
    const docCount = await docColl.count();
    const feedbackCount = await feedbackColl.count();
    // Approximate chunk count by counting ids (if supported)
    const docInfo = await docColl.get({ ids: [] }); // returns empty but we can get count via metadata?
    const response = {
      documentCount: docCount,
      feedbackCount,
      status: "ok",
    };
    res.json(response);
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Dashboard fetch failed" });
  }
});

export default router;

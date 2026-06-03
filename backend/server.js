// server.js - Entry point for Recall-GPT backend
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import chatRouter from "./controllers/chatController.js";
import reindexRouter from "./controllers/reindexController.js";
import dashboardRouter from "./controllers/dashboardController.js";
import pingRouter from "./controllers/pingController.js";
import feedbackRouter from "./controllers/feedbackController.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api/chat", chatRouter);
app.use("/api/reindex", reindexRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/ping", pingRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`🚀 Server listening on http://localhost:${port}`);
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const nextPort = parseInt(port) + 1;
      console.warn(`Port ${port} in use, trying ${nextPort}`);
      startServer(nextPort);
    } else {
      console.error('Server error:', err);
    }
  });
}

if (!process.env.VERCEL) {
  startServer(PORT);
}

export default app;

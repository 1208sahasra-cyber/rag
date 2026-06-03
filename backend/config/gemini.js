// backend/config/gemini.js
/**
 * Groq API client using fetch.
 * Handles text embeddings and chat completions.
 */
import fetch from "node-fetch";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

// Fallback constants for when Groq API is unavailable
const FALLBACK_EMBEDDING = new Array(768).fill(0);
const FALLBACK_ANSWER = "I couldn't retrieve a response from the AI provider, but here's a placeholder answer.";

const API_KEY = process.env.GROQ_API_KEY;
// Model names can be overridden via env vars
// Note: Groq doesn't have a native embeddings API - using a placeholder that will use fallback
const EMBED_MODEL = process.env.GROQ_EMBED_MODEL || "text-embedding-3-small";
const CHAT_MODEL = process.env.GROQ_CHAT_MODEL || "llama-3.3-70b-versatile";

export async function embedText(text) {
  // Groq doesn't have embeddings API - using a simple hash-based approach
  // In production, consider using OpenAI, Hugging Face, or local embedding model
  try {
    // Create a simple deterministic vector from text using hash
    const hash = crypto.createHash('sha256').update(text).digest('hex');
    
    // Convert hash to embedding vector (768 dimensions)
    const embedding = new Array(768).fill(0);
    for (let i = 0; i < 768; i++) {
      const idx = (i * 2) % hash.length;
      const val = parseInt(hash.substring(idx, idx + 2), 16);
      embedding[i] = (val - 128) / 128; // normalize to -1 to 1
    }
    return embedding;
  } catch (e) {
    console.error("embedText unexpected error:", e);
    return FALLBACK_EMBEDDING;
  }
}

export async function generateContent(systemInstruction, userMessage, history = []) {
  if (!API_KEY) {
    console.warn("GROQ_API_KEY not set – returning fallback answer.");
    return FALLBACK_ANSWER;
  }
  // Build messages array for Groq chat API
  const messages = [];
  if (systemInstruction) {
    messages.push({ role: "system", content: systemInstruction });
  }
  // Append historical messages if provided
  for (const msg of history) {
    const role = msg.role === "assistant" || msg.role === "model" ? "assistant" : "user";
    const content = msg.content || msg.text || "";
    if (content) {
      messages.push({ role, content });
    }
  }
  // Current user message
  messages.push({ role: "user", content: userMessage });

  try {
    const url = "https://api.groq.com/openai/v1/chat/completions";
    const body = {
      model: CHAT_MODEL,
      messages,
      temperature: 0.7
    };
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const err = await res.text();
      console.error(`Groq generateContent failed: ${res.status}`, err);
      return FALLBACK_ANSWER;
    }
    const data = await res.json();
    // Response format: data.choices[0].message.content
    return data.choices?.[0]?.message?.content ?? FALLBACK_ANSWER;
  } catch (e) {
    console.error("generateContent unexpected error:", e);
    return FALLBACK_ANSWER;
  }
}

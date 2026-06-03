// backend/services/searchService.js
/**
 * Hybrid search implementation:
 * 1️⃣ Keyword search – simple case‑insensitive substring matches over stored documents.
 * 2️⃣ Vector search – cosine similarity via ChromaDB.
 * 3️⃣ Reciprocal Rank Fusion (RRF) – merges both result lists and returns top 5.
 * 4️⃣ In-Context Learning (ICL) Exemplars – queries feedback collection for similar past interactions.
 * 5️⃣ Groq content generation using the retrieved context.
 */
import { getCollection } from "../config/db.js";
import { embedText, generateContent } from "../config/gemini.js";
import { getSimilarFeedback } from "./feedbackService.js";
import dotenv from "dotenv";

dotenv.config();

// Simple keyword search over collection documents
async function keywordSearch(collection, query, topK = 20) {
  try {
    const all = await collection.get();
    const results = [];
    const lowered = query.toLowerCase();
    for (let i = 0; i < (all.documents?.length || 0); i++) {
      const doc = all.documents[i];
      if (doc && doc.toLowerCase().includes(lowered)) {
        results.push({
          id: all.ids[i],
          score: 1, // placeholder rank for RRF
          document: doc,
          metadata: all.metadatas[i]
        });
      }
      if (results.length >= topK) break;
    }
    return results;
  } catch (err) {
    console.error("Keyword search error:", err);
    return [];
  }
}

// Vector search via ChromaDB similarity
async function vectorSearch(collection, embedding, topK = 20) {
  try {
    const res = await collection.query({
      queryEmbeddings: [embedding],
      nResults: topK,
      include: ["documents", "metadatas", "distances"]
    });
    const results = [];
    const ids = res.ids?.[0] || [];
    const docs = res.documents?.[0] || [];
    const metadatas = res.metadatas?.[0] || [];
    const distances = res.distances?.[0] || [];
    for (let i = 0; i < ids.length; i++) {
      results.push({
        id: ids[i],
        score: distances[i], // lower distance = higher relevance
        document: docs[i],
        metadata: metadatas[i]
      });
    }
    return results;
  } catch (err) {
    console.error("Vector search query error:", err);
    return [];
  }
}

// Reciprocal Rank Fusion – combines two ranked lists
function reciprocalRankFusion(listA, listB, topK = 5, k = 60) {
  const fused = new Map();
  const add = (list) => {
    list.forEach((item, idx) => {
      const rank = idx + 1;
      const prev = fused.get(item.id) ?? 0;
      fused.set(item.id, prev + 1 / (k + rank));
    });
  };
  add(listA);
  add(listB);
  
  const combined = [];
  for (const [id, score] of fused.entries()) {
    const orig = listA.find((i) => i.id === id) || listB.find((i) => i.id === id);
    if (orig) {
      combined.push({ ...orig, fusedScore: score });
    }
  }
  combined.sort((a, b) => b.fusedScore - a.fusedScore);
  return combined.slice(0, topK);
}

export async function chatHandler(message, history = []) {
  // 1. Retrieve relevant chunks via hybrid search
  let collection;
  let kwResults = [];
  let vecResults = [];
  
  try {
    collection = await getCollection(process.env.CHROMADB_COLLECTION || "document_collection");
    kwResults = await keywordSearch(collection, message);
  } catch (err) {
    console.error("Chroma connection or keyword search failed:", err);
  }
  
  try {
    if (collection) {
      const queryEmbedding = await embedText(message);
      vecResults = await vectorSearch(collection, queryEmbedding);
    }
  } catch (err) {
    console.error("Vector embedding or vector search failed:", err.message);
  }

  // Fusion
  const fused = reciprocalRankFusion(kwResults, vecResults);
  const retrievedContext = fused.map((r) => r.document).join("\n---\n");

  // 2. Retrieve few‑shot exemplars from feedback collection
  let exemplars = [];
  try {
    exemplars = await getSimilarFeedback(message, 2);
  } catch (err) {
    console.error("Feedback exemplar fetch failed:", err.message);
  }

  // 3. Build system instruction
  const exemplarsBlock = exemplars.length > 0
    ? exemplars.map((e) => `Q: ${e.question}\nA: ${e.correctedAnswer || e.answer}`).join("\n---\n")
    : "None available.";

  const systemInstruction = `You are an uncompromising, production-grade RAG assistant.
Task: Answer the User Question using ONLY the provided Document Context and guided by successful Past Exemplars.

[Past Exemplars]
${exemplarsBlock}

[Document Context]
${retrievedContext || "No context documents uploaded."}

Strict Rule 1: If the answer cannot be confidently derived directly from the Document Context, reply exactly: "I could not find this information in the uploaded documents." Do not hallucinate or extrapolate.
Strict Rule 2: Provide clear inline citations linking back to the source file name (e.g. [source_file.pdf]).`;

  // 4. Call Groq model for generation
  let answer = "";
  try {
    answer = await generateContent(systemInstruction, message, history);
  } catch (err) {
    console.error("Error generating response from Groq:", err);
    answer = `Groq API Error: ${err.message}. Please check that your GROQ_API_KEY environment variable is set and active in your backend/.env file.`;
  }

  const citations = fused.map((r) => ({
    file_name: r.metadata?.file_name || "unknown",
    chunk_id: r.metadata?.chunk_id || "unknown"
  }));

  const feedbackOptimized = exemplars.length > 0;

  return {
    answer,
    citations,
    feedback_optimized: feedbackOptimized
  };
}

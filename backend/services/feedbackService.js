import { getChromaClient } from '../config/db.js';
import { embedText } from '../config/gemini.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service for handling user feedback and exemplars.
 * Stores feedback Q&A pairs in a secondary Chroma collection (feedback_collection).
 * Provides methods to add new feedback and to retrieve similar past interactions
 * using the same embedding model as the document pipeline.
 */

/**
 * Ensure the feedback collection exists and return it.
 */
async function getFeedbackCollection() {
  const client = await getChromaClient();
  const collectionName = process.env.CHROMADB_FEEDBACK_COLLECTION || 'feedback_collection';
  const collection = await client.getOrCreateCollection({
    name: collectionName
  });
  return collection;
}

/**
 * Add a feedback entry.
 * @param {Object} param0
 * @param {string} param0.question - Original user question.
 * @param {string} param0.answer - Model answer that was returned.
 * @param {number} param0.rating - User rating (e.g., 1‑5).
 * @param {string} [param0.correctedAnswer] - Optional corrected answer supplied by the user.
 */
export async function addFeedback({ question, answer, rating, correctedAnswer }) {
  try {
    const collection = await getFeedbackCollection();
    const id = uuidv4();
    const meta = {
      id,
      question,
      answer,
      rating: rating?.toString() ?? '0',
      correctedAnswer: correctedAnswer ?? '',
      timestamp: new Date().toISOString(),
    };
    const embedding = await embedText(question);
    await collection.add({ ids: [id], embeddings: [embedding], metadatas: [meta] });
    return { success: true, id };
  } catch (err) {
    console.error('Error adding feedback:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Retrieve the most similar past feedback entries for a given query.
 * Used by the chat service to inject few‑shot exemplars.
 * @param {string} query - The incoming user question.
 * @param {number} [topK=2] - Number of exemplars to return.
 * @returns {Promise<Array>} Array of exemplar objects.
 */
export async function getSimilarFeedback(query, topK = 2) {
  try {
    const collection = await getFeedbackCollection();
    const embedding = await embedText(query);
    const results = await collection.query({
      queryEmbeddings: [embedding],
      nResults: topK,
      include: ['metadatas'],
    });
    const exemplars = (results.metadatas?.[0] || []).map((meta) => ({
      question: meta.question,
      answer: meta.answer,
      correctedAnswer: meta.correctedAnswer,
    }));
    return exemplars;
  } catch (err) {
    console.error('Error fetching similar feedback:', err);
    return [];
  }
}

// Map the exports to match controllers/feedbackController.js
export const logFeedback = addFeedback;
export const getExemplars = getSimilarFeedback;

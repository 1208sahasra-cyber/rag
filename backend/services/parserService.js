// parserService.js - Document ingestion, cleaning, chunking, embedding, storing
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { v4 as uuidv4 } from "uuid";
import { getCollection } from "../config/db.js";
import { embedText } from "../config/gemini.js";
import { splitIntoChunks } from "../utils/textSplitter.js";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DOC_DIR = path.resolve(__dirname, "../doc");

// Ensure doc directory exists
if (!fs.existsSync(DOC_DIR)) {
  fs.mkdirSync(DOC_DIR, { recursive: true });
}

const SUPPORTED_EXT = [".txt", ".md", ".pdf", ".docx"];

export async function reindexDocuments() {
  const files = fs.readdirSync(DOC_DIR).filter((f) => SUPPORTED_EXT.includes(path.extname(f).toLowerCase()));
  const collection = await getCollection(process.env.CHROMADB_COLLECTION || "document_collection");
  // flush existing docs
  await collection.delete();

  let totalChunks = 0;
  for (const file of files) {
    const filePath = path.join(DOC_DIR, file);
    const ext = path.extname(file).toLowerCase();
    let rawText = "";
    try {
      if (ext === ".txt" || ext === ".md") {
        rawText = fs.readFileSync(filePath, "utf-8");
      } else if (ext === ".pdf") {
        const data = fs.readFileSync(filePath);
        const pdf = await pdfParse(data);
        rawText = pdf.text;
      } else if (ext === ".docx") {
        const result = await mammoth.extractRawText({ path: filePath });
        rawText = result.value;
      }
    } catch (e) {
      console.warn(`Failed to parse ${file}:`, e);
      continue; // skip corrupted files
    }
    // Clean text
    const cleaned = rawText
      .replace(/\s+/g, " ") // collapse whitespace
      .trim();
    if (!cleaned) continue;

    const chunks = splitIntoChunks(cleaned, 800, 150);
    const timestamp = new Date().toISOString();
    for (let i = 0; i < chunks.length; i++) {
      const chunkId = uuidv4();
      const metadata = {
        file_name: file,
        chunk_id: chunkId,
        total_chunks: chunks.length,
        chunk_index: i + 1,
        timestamp,
      };
      const embedding = await embedText(chunks[i]);
      await collection.add({ ids: [chunkId], embeddings: [embedding], documents: [chunks[i]], metadatas: [metadata] });
    }
    totalChunks += chunks.length;
  }
  return { documentCount: files.length, totalChunks };
}

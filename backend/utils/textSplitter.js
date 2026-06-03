// utils/textSplitter.js
/**
 * Split a long string into overlapping semantic chunks.
 * Approximate token count using word count (1 token ≈ 0.75 words).
 * Uses paragraph, sentence, then word boundaries.
 */
export function splitIntoChunks(text, maxTokens = 800, overlapTokens = 150) {
  // Rough conversion word -> token
  const wordsPerToken = 0.75;
  const maxWords = Math.floor(maxTokens / wordsPerToken);
  const overlapWords = Math.floor(overlapTokens / wordsPerToken);

  // First split by paragraphs
  const paragraphs = text.split(/\n\n+/).filter(Boolean);
  const chunks = [];
  let buffer = "";

  for (let i = 0; i < paragraphs.length; i++) {
    const candidate = buffer ? buffer + "\n\n" + paragraphs[i] : paragraphs[i];
    const wordCount = candidate.split(/\s+/).length;
    if (wordCount <= maxWords) {
      buffer = candidate;
    } else {
      // buffer exceeds limit: push current buffer as chunk
      if (buffer) {
        chunks.push(buffer.trim());
        // start new buffer with overlap of last overlapWords words
        const words = buffer.split(/\s+/);
        buffer = words.slice(-overlapWords).join(" ");
      }
      // now process the long paragraph recursively (sentence split)
      const sentences = paragraphs[i].split(/(?<=[.!?])\s+/).filter(Boolean);
      for (const sentence of sentences) {
        const cand = buffer ? buffer + " " + sentence : sentence;
        const wc = cand.split(/\s+/).length;
        if (wc <= maxWords) {
          buffer = cand;
        } else {
          if (buffer) {
            chunks.push(buffer.trim());
            const w = buffer.split(/\s+/);
            buffer = w.slice(-overlapWords).join(" ");
          }
          // sentence itself too big, split by words
          const wordsArr = sentence.split(/\s+/);
          for (let j = 0; j < wordsArr.length; j += maxWords - overlapWords) {
            const segment = wordsArr.slice(j, j + maxWords).join(" ");
            chunks.push(segment.trim());
          }
          buffer = "";
        }
      }
    }
  }
  if (buffer) chunks.push(buffer.trim());
  return chunks;
}

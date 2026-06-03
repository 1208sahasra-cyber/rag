// backend/config/db.js
import { ChromaClient, CloudClient } from 'chromadb';
import dotenv from 'dotenv';

dotenv.config();

let client;

if (process.env.CHROMA_API_KEY) {
  client = new CloudClient({
    apiKey: process.env.CHROMA_API_KEY,
    tenant: process.env.CHROMA_TENANT || 'default_tenant',
    database: process.env.CHROMA_DATABASE || 'default_database',
    cloudHost: process.env.CHROMA_HOST ? (process.env.CHROMA_HOST.startsWith('http') ? process.env.CHROMA_HOST : `https://${process.env.CHROMA_HOST}`) : undefined,
    cloudPort: '443'
  });
} else {
  client = new ChromaClient({
    path: process.env.CHROMADB_HOST || 'http://localhost:8000'
  });
}

export const getChromaClient = () => {
  return client;
};

export const getCollection = async (name) => {
  const collection = await client.getOrCreateCollection({ name });
  return collection;
};

export default client;

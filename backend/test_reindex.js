import { reindexDocuments } from './services/parserService.js';
import dotenv from 'dotenv';

dotenv.config();

try {
  console.log('Testing reindexDocuments()...');
  const res = await reindexDocuments();
  console.log('Success! Result:', res);
} catch (err) {
  console.error('Error in reindexDocuments:', err);
}

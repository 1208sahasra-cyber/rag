# Recall-GPT: Memory-Grounded RAG Assistant

A full-stack Retrieval-Augmented Generation (RAG) system powered by Groq AI, featuring a React frontend and Node.js backend with ChromaDB vector storage.

## Features

✅ **RAG-powered responses** - Answers grounded in uploaded documents  
✅ **Groq Integration** - Fast AI responses using Groq's LLM API  
✅ **ChromaDB Vector Search** - Semantic document retrieval  
✅ **50 Education Documents** - Pre-loaded with comprehensive education topics  
✅ **Hybrid Search** - Keyword + vector-based document matching  
✅ **Feedback System** - Improve responses through user feedback  
✅ **Session Management** - Multiple chat sessions with history  
✅ **Real-time Indexing** - Reindex documents on demand  

## Project Structure

```
recall-gpt/
├── backend/
│   ├── config/
│   │   ├── db.js                 (ChromaDB setup)
│   │   ├── gemini.js             (Groq API client)
│   │   └── config.json
│   ├── controllers/
│   │   ├── chatController.js
│   │   ├── reindexController.js
│   │   ├── dashboardController.js
│   │   ├── feedbackController.js
│   │   └── pingController.js
│   ├── services/
│   │   ├── searchService.js      (Hybrid search + RAG)
│   │   ├── feedbackService.js
│   │   └── parserService.js
│   ├── doc/
│   │   └── Education_1.txt to Education_50.txt
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── vercel.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   └── components/
│   │       ├── ChatWindow.jsx
│   │       ├── Dashboard.jsx
│   │       ├── Sidebar.jsx
│   │       └── LoadingSpinner.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── vercel.json
│   ├── .env.example
│   └── tailwind.config.cjs
│
├── .gitignore
└── README.md
```

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Groq API Key: [Get from console.groq.com](https://console.groq.com)
- ChromaDB Cloud account (optional, or use local ChromaDB)

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/1208sahasra-cyber/rag.git
   cd recall-gpt
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your API keys
   npm start
   ```
   Backend runs on `http://localhost:5002`

3. **Frontend Setup** (in new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend runs on `http://localhost:5177`

## Environment Variables

### Backend (.env)
```
PORT=5002
GROQ_API_KEY=your_groq_api_key

CHROMA_HOST=api.trychroma.com
CHROMA_API_KEY=your_chroma_api_key
CHROMA_TENANT=your_tenant_id
CHROMA_DATABASE=student

LANGSMITH_TRACING=true
LANGSMITH_ENDPOINT=https://api.smith.langchain.com
LANGSMITH_API_KEY=your_langsmith_key
LANGSMITH_PROJECT=summarizer
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend-domain.vercel.app
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | Send message & get RAG response |
| `/api/reindex` | POST | Reindex all documents |
| `/api/dashboard` | GET | Get stats (docs, feedback count) |
| `/api/feedback` | POST | Submit feedback for responses |
| `/api/ping` | GET | Health check |
| `/api/health` | GET | Server status |

## Deployment to Vercel

### 1. Prepare for Deployment

```bash
# Push to GitHub
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Deploy Backend

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the `backend` directory as the root
5. Set Environment Variables:
   - `GROQ_API_KEY` - Your Groq API key
   - `CHROMA_HOST` - ChromaDB host
   - `CHROMA_API_KEY` - ChromaDB API key
   - `CHROMA_TENANT` - ChromaDB tenant ID
   - `CHROMA_DATABASE` - Database name
6. Deploy

**Backend URL Example:** `https://recall-gpt-backend.vercel.app`

### 3. Deploy Frontend

1. In Vercel, click "New Project"
2. Import your GitHub repository again
3. Select the `frontend` directory as the root
4. Set Environment Variables:
   - `VITE_API_URL` - Your backend Vercel URL (from step 2)
5. Build Settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Deploy

**Frontend URL Example:** `https://recall-gpt-frontend.vercel.app`

## API Response Examples

### Chat Endpoint
```bash
curl -X POST http://localhost:5002/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is STEM education?",
    "history": []
  }'
```

**Response:**
```json
{
  "answer": "STEM (Science, Technology, Engineering, Mathematics) education...",
  "citations": [
    {
      "file_name": "Education_13.txt",
      "chunk_id": "uuid-here"
    }
  ],
  "feedback_optimized": false
}
```

## Technologies Used

### Backend
- **Node.js/Express** - REST API server
- **Groq AI** - Fast LLM inference
- **ChromaDB** - Vector database
- **PDF-Parse** - Document parsing
- **Mammoth** - DOCX document parsing

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **JavaScript ES6+**

## Key Features Explained

### Hybrid Search
Combines keyword and semantic search:
1. **Keyword Search** - Fast substring matching
2. **Vector Search** - Semantic similarity via embeddings
3. **Reciprocal Rank Fusion** - Merges both results

### RAG Implementation
1. User sends query
2. System retrieves relevant documents
3. Groq AI generates answer using context
4. Citations show source documents

### Document Management
- Supports: .txt, .md, .pdf, .docx
- Automatic chunking and embedding
- On-demand reindexing

## Troubleshooting

### 404 Error on Vercel
- Verify backend URL is correct in frontend environment
- Check CORS settings in backend
- Ensure API routes are properly configured

### ChromaDB Connection Issues
- Verify CHROMA_HOST, CHROMA_API_KEY
- Check if ChromaDB cloud is accessible
- For local setup, use `http://localhost:8000`

### Groq API Errors
- Verify GROQ_API_KEY is valid
- Check API key has necessary permissions
- Ensure rate limits not exceeded

## Performance Optimization

- Vector embeddings cached in ChromaDB
- Keyword search optimized with indexing
- Frontend session state in localStorage
- API responses gzipped

## Future Improvements

- [ ] Multi-language support
- [ ] Custom embedding models
- [ ] Advanced query understanding
- [ ] Batch document upload
- [ ] Analytics dashboard
- [ ] Team collaboration features

## License

MIT License - feel free to use for personal and commercial projects

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review environment variable setup
3. Check GitHub issues
4. Contact support

---

**Deployed Links:**
- Frontend: [Your Frontend URL]
- Backend: [Your Backend URL]
- GitHub: https://github.com/1208sahasra-cyber/rag

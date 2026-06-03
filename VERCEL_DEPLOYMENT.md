# VERCEL DEPLOYMENT GUIDE

## Errors Fixed

### 1. **404 Error - Backend Not Deployed**
   - **Problem**: API endpoint returned 404 because backend wasn't deployed to Vercel
   - **Fix**: Created `vercel.json` files for both frontend and backend to configure Vercel deployment

### 2. **Missing Environment Variables**
   - **Problem**: Backend couldn't connect to Groq API or ChromaDB on Vercel
   - **Fix**: Created `.env.example` files showing required variables; must be added to Vercel Dashboard

### 3. **Frontend-Backend Communication**
   - **Problem**: Frontend didn't know how to reach backend on Vercel
   - **Fix**: Updated `vite.config.js` and created `.env.example` for frontend with `VITE_API_URL`

### 4. **CORS and API Routing**
   - **Problem**: Routes not properly configured for Vercel serverless
   - **Fix**: Added proper `vercel.json` routing configuration

---

## Step-by-Step Deployment Instructions

### STEP 1: Deploy Backend to Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign in (create account if needed)

2. **Click "New Project"** → Select "Import Git Repository"

3. **Select your GitHub repository** (https://github.com/1208sahasra-cyber/rag)

4. **Configure Project:**
   - **Framework Preset**: Other (Node.js)
   - **Root Directory**: `backend`
   - **Build Command**: Leave empty (Node.js handles it)
   - **Output Directory**: `./` (Vercel serves entire backend directory)
   - **Install Command**: `npm install`
   - **Start Command**: `npm start`

5. **Add Environment Variables** (Click "Environment Variables"):
   ```
   PORT = 5002
   GROQ_API_KEY = gsk_... (your actual key from console.groq.com)
   CHROMA_HOST = api.trychroma.com
   CHROMA_API_KEY = (your ChromaDB API key)
   CHROMA_TENANT = (your ChromaDB tenant ID)
   CHROMA_DATABASE = student
   LANGSMITH_TRACING = true
   LANGSMITH_ENDPOINT = https://api.smith.langchain.com
   LANGSMITH_API_KEY = (your LangSmith key)
   LANGSMITH_PROJECT = summarizer
   ```

6. **Click "Deploy"** and wait for deployment to complete

7. **Note your Backend URL**: It will be something like:
   ```
   https://recall-gpt-backend.vercel.app
   ```

### STEP 2: Deploy Frontend to Vercel

1. **In Vercel Dashboard**, click "New Project"

2. **Select same GitHub repository** again

3. **Configure Project:**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables:**
   ```
   VITE_API_URL = https://recall-gpt-backend.vercel.app
   ```
   (Use the backend URL from Step 1)

5. **Click "Deploy"** and wait for completion

6. **Note your Frontend URL**: It will be something like:
   ```
   https://recall-gpt-frontend.vercel.app
   ```

---

## Files Already Configured for Vercel

✅ **backend/vercel.json** - Routes all requests to Express server
✅ **frontend/vercel.json** - Handles API proxy routing and SPA rewrites  
✅ **backend/.env.example** - Template for required environment variables
✅ **frontend/.env.example** - Template for frontend API URL
✅ **.gitignore** - Prevents .env files from being committed
✅ **README.md** - Complete project documentation
✅ **All files pushed to GitHub** - Ready for Vercel import

---

## Testing After Deployment

### Test Backend:
```bash
# In browser, visit:
https://recall-gpt-backend.vercel.app/api/health

# Should return:
{"status":"ok","timestamp":"..."}
```

### Test Frontend:
```bash
# Visit frontend URL:
https://recall-gpt-frontend.vercel.app

# Should load the UI. Try:
1. Click "Reindex Documents" (should show success)
2. Type a question and chat (should get responses from Groq)
3. Dashboard should show "50 documents" and stats
```

### Test Full Chat Flow:
```
- Open frontend URL
- Type: "What is STEM education?"
- Should get response with citations from Education documents
- Check browser console for any errors
```

---

## Troubleshooting Deployment Errors

### Error: "Cannot find module 'dotenv'"
- **Solution**: Environment variables set on Vercel Dashboard, not in .env file
- Already configured in backend package.json

### Error: "GROQ_API_KEY not set"
- **Solution**: Add GROQ_API_KEY to Vercel Environment Variables
- Go to Project Settings → Environment Variables

### Error: "ChromaDB Connection Failed"
- **Solution**: Verify CHROMA_HOST, CHROMA_API_KEY, CHROMA_TENANT are correct
- Test locally first: `npm start` in backend folder

### Error: "404 on API calls from frontend"
- **Solution**: Verify VITE_API_URL is correct and matches backend Vercel URL
- Check browser console Network tab for actual request URL

### Error: "CORS blocked request"
- **Solution**: Backend CORS already configured for all origins
- If still blocked, check browser console for specific error

---

## Final Checklist

Before considering deployment complete:

- [ ] Backend deployed and `/api/health` returns `{"status":"ok"}`
- [ ] Frontend deployed and loads without JS errors
- [ ] Frontend can reach backend (check Network tab in DevTools)
- [ ] Chat responds to questions (test: "What is education?")
- [ ] Dashboard shows 50 documents
- [ ] Reindex endpoint works (click "Reindex Documents")
- [ ] All environment variables set on Vercel Dashboard

---

## Success Indicators

After deployment, you should see:

✅ Frontend loads on `https://your-frontend-domain.vercel.app`
✅ Backend API responds on `https://your-backend-domain.vercel.app/api/health`
✅ Chat works and returns answers with citations
✅ Dashboard shows document count and stats
✅ No console errors in browser DevTools

---

## Important Notes

1. **Environment Variables**: Must be added on Vercel Dashboard, NOT in code
2. **Git Ignored**: `.env` files are in .gitignore for security
3. **Separate Deployments**: Frontend and Backend are separate Vercel projects
4. **API URL**: Frontend must know the exact backend URL (no localhost)
5. **Custom Domain**: Can add custom domains in Vercel Dashboard settings

---

## Support

If you encounter issues:
1. Check Vercel Dashboard → Deployments → Logs
2. Check browser DevTools → Console for frontend errors
3. Verify all environment variables are set
4. Verify backend URL is accessible (paste in browser)
5. Check ChromaDB connection with local test first

---

All files have been pushed to: https://github.com/1208sahasra-cyber/rag
Ready to deploy! Follow the steps above for your Vercel deployment.

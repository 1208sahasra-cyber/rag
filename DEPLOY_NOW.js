#!/usr/bin/env node

// VERCEL DEPLOYMENT QUICK START
// This file documents the exact steps needed to deploy to Vercel

console.log(`
╔════════════════════════════════════════════════════════════════╗
║         RECALL-GPT VERCEL DEPLOYMENT QUICK START               ║
╚════════════════════════════════════════════════════════════════╝

✅ VERIFIED: 
   - Backend: npm dependencies installed ✓
   - Frontend: npm dependencies installed ✓
   - Frontend: builds successfully ✓
   - All config files created ✓
   - Code pushed to GitHub ✓

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1: DEPLOY BACKEND (5 minutes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Go to: https://vercel.com
2. Sign in with GitHub
3. Click "New Project"
4. Select: "Recall-GPT" or your forked repo
5. IMPORTANT - Set these settings:
   
   Root Directory: backend  ← SELECT THIS
   Framework: Other
   
6. DON'T click Deploy yet! Go to "Environment Variables"
7. Add EACH variable below:

   GROQ_API_KEY
   Value: gsk_... (get from https://console.groq.com)
   
   CHROMA_HOST
   Value: api.trychroma.com
   
   CHROMA_API_KEY
   Value: (your ChromaDB API key)
   
   CHROMA_TENANT
   Value: (your ChromaDB tenant ID)
   
   CHROMA_DATABASE
   Value: student
   
   LANGSMITH_TRACING
   Value: true
   
   LANGSMITH_ENDPOINT
   Value: https://api.smith.langchain.com
   
   LANGSMITH_API_KEY
   Value: (your LangSmith API key)
   
   LANGSMITH_PROJECT
   Value: summarizer

8. Click "Deploy" button
9. Wait 2-3 minutes for deployment
10. Copy the deployed URL (e.g., https://recall-gpt-backend.vercel.app)
    ⭐ SAVE THIS URL - YOU'LL NEED IT FOR FRONTEND!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 2: TEST BACKEND (1 minute)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Copy your backend URL from Step 1
2. Paste in browser: https://YOUR-BACKEND-URL/api/health
3. Should see: {"status":"ok","timestamp":"..."}
4. If you see an error, check:
   - All environment variables are set (double-check spelling!)
   - GROQ_API_KEY is valid and starts with "gsk_"
   - ChromaDB credentials are correct

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 3: DEPLOY FRONTEND (5 minutes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Back on Vercel: https://vercel.com
2. Click "New Project"
3. Select SAME GitHub repo again (Recall-GPT)
4. Set these settings:
   
   Root Directory: frontend  ← SELECT THIS
   Framework: Vite
   Build Command: npm run build
   Output Directory: dist
   
5. Go to "Environment Variables"
6. Add ONE variable:

   VITE_API_URL
   Value: https://YOUR-BACKEND-URL  ← USE THE URL FROM STEP 1!
   (Example: https://recall-gpt-backend.vercel.app)

7. Click "Deploy" button
8. Wait 2-3 minutes for deployment
9. You'll get Frontend URL (e.g., https://recall-gpt-frontend.vercel.app)
    ⭐ THIS IS YOUR FINAL LINK!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 4: TEST FULL APPLICATION (5 minutes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Visit your Frontend URL in browser
2. Should see Recall-GPT interface
3. Look at bottom - Dashboard should show "50 documents"
4. Try this:
   - Click "Reindex Documents" (should show success)
   - Type question: "What is STEM education?"
   - Should get response with citations

5. Open browser DevTools (F12 → Console tab)
   - Should NOT see red errors
   - May see yellow warnings (ignore these)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ SUCCESS CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

☐ Backend deployed and health check returns {"status":"ok"}
☐ Frontend deployed and loads without white screen
☐ Frontend shows "50 documents" in dashboard
☐ Chat works: can ask question and get response
☐ Console has no red errors
☐ Reindex button works
☐ All environment variables set on Vercel

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 IF ALL CHECKMARKS ARE DONE:
   You have successfully deployed Recall-GPT to Vercel!

📚 YOUR FINAL LINKS:
   Frontend: https://recall-gpt-frontend.vercel.app
   Backend:  https://recall-gpt-backend.vercel.app
   GitHub:   https://github.com/1208sahasra-cyber/rag

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TROUBLESHOOTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Q: Backend shows 404 error
A: Check Vercel Dashboard → Deployments → scroll down for error logs

Q: Frontend shows blank white screen
A: Open DevTools Console (F12) and check for errors
   Usually means VITE_API_URL is wrong

Q: Chat doesn't work, shows "Error loading response"
A: Check browser console, usually missing environment variable
   Or GROQ_API_KEY is invalid

Q: Reindex button doesn't work
A: Check that backend URL is accessible from frontend
   Test: paste backend URL in browser, should show {"status":"ok"}

Q: How do I update the app after deployment?
A: Push changes to GitHub, Vercel auto-deploys
   git add . && git commit -m "message" && git push origin main

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ready to deploy? Go to https://vercel.com and follow Step 1 above!
`);

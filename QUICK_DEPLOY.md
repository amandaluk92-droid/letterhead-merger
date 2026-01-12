# Quick Deployment Guide

## Fastest Way: Vercel (Recommended)

### Option A: Via GitHub (Easiest)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "Add New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Vite - just click "Deploy"
6. Done! Your site will be live in ~2 minutes

### Option B: Via CLI
```bash
npm i -g vercel
vercel
```
Follow the prompts. Your site will be live immediately.

## Alternative: Netlify

### Via GitHub
1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) and sign in
3. Click "Add new site" > "Import an existing project"
4. Connect your GitHub repository
5. Build settings (auto-detected):
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

### Via CLI
```bash
npm i -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

## What Gets Deployed

- ✅ All client-side code (runs in browser)
- ✅ No backend needed
- ✅ No environment variables needed
- ✅ Works immediately after deployment

## After Deployment

1. Test file uploads
2. Test document merging
3. Test formatting panel
4. Test downloads

Your app is ready to use! 🚀

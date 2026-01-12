# Deployment Guide

This guide covers deploying the Letterhead Merger application to various platforms.

## Prerequisites

- Node.js 18+ installed
- Git repository set up (if deploying via Git)
- Account on your chosen deployment platform

## Build the Application

Before deploying, test the build locally:

```bash
npm install
npm run build
```

The built files will be in the `dist/` directory.

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides excellent support for Vite applications.

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via CLI**:
   ```bash
   vercel
   ```

3. **Or deploy via GitHub**:
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Vercel will auto-detect Vite and configure it
   - Click "Deploy"

The `vercel.json` file is already configured for this project.

### Option 2: Netlify

1. **Install Netlify CLI** (optional):
   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy via CLI**:
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

3. **Or deploy via GitHub**:
   - Push your code to GitHub
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"

The `netlify.toml` file is already configured for this project.

### Option 3: GitHub Pages

1. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json scripts**:
   ```json
   "deploy": "npm run build && gh-pages -d dist"
   ```

3. **Update vite.config.ts** to include base path:
   ```typescript
   export default defineConfig({
     plugins: [react()],
     base: '/your-repo-name/', // Replace with your GitHub repo name
   })
   ```

4. **Deploy**:
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages**:
   - Go to repository Settings > Pages
   - Select source branch: `gh-pages`
   - Save

### Option 4: Any Static Hosting

The built files in `dist/` can be uploaded to any static hosting service:

- **AWS S3 + CloudFront**
- **Google Cloud Storage**
- **Azure Static Web Apps**
- **Cloudflare Pages**
- **Any web server** (nginx, Apache, etc.)

Simply upload the contents of the `dist/` directory to your hosting service.

## Environment Variables

No environment variables are required for this application. All processing happens client-side.

## Important Notes

1. **Client-Side Only**: This application runs entirely in the browser. No backend server is required.

2. **File Processing**: All document processing happens client-side using JavaScript libraries. Large files may take time to process.

3. **Browser Compatibility**: The app uses modern JavaScript features. Ensure users have up-to-date browsers.

4. **Build Output**: After building, the `dist/` folder contains all static files needed for deployment.

## Troubleshooting

### Build Fails

- Ensure all dependencies are installed: `npm install`
- Check for TypeScript errors: `npm run lint`
- Verify Node.js version is 18+

### 404 Errors on Routes

- Ensure your hosting platform is configured to serve `index.html` for all routes (SPA routing)
- Vercel and Netlify configs are already set up for this

### Large Bundle Size

- The app includes document processing libraries which increase bundle size
- This is expected and necessary for client-side document processing

## Post-Deployment

After deployment:

1. Test the application thoroughly
2. Verify file uploads work correctly
3. Test document merging functionality
4. Check formatting panel works as expected
5. Ensure downloads work properly

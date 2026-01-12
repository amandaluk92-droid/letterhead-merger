# Setup and Testing Instructions

## Prerequisites

Make sure you have Node.js and npm installed:
- Download from: https://nodejs.org/ (LTS version recommended)
- Or install via Homebrew: `brew install node`
- Verify installation: `node --version` and `npm --version`

## Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```
   This will install all required packages including React, Vite, TypeScript, Tailwind CSS, and document processing libraries.

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   This will start the Vite development server. You should see output like:
   ```
   VITE v5.0.8  ready in XXX ms

   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```

3. **Open in Browser**
   - Open your browser and navigate to: `http://localhost:5173`
   - The application should load automatically

## Testing the Application

1. **Upload Letterhead**
   - Click or drag-and-drop your letterhead `.docx` file in the "Letterhead Template" section
   - You can use the existing "Total health Letter head.docx" file as a test

2. **Upload Target Documents**
   - Click or drag-and-drop one or more target `.docx` files in the "Target Documents" section
   - Multiple files can be selected

3. **Configure Formatting (Optional)**
   - Use the formatting panel to customize:
     - Font family, size, color
     - Bold, italic, underline
     - Text alignment
     - Character spacing, line spacing
     - Paragraph spacing

4. **Merge Documents**
   - Click the "Merge All Documents" button
   - Wait for processing (progress will be shown)

5. **Download Results**
   - Once complete, download individual merged documents
   - Or download all as a ZIP file

## Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically use the next available port. Check the terminal output for the actual port number.

### Module Not Found Errors
If you see module errors:
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
The project uses TypeScript. If you see compilation errors, check that all dependencies are installed correctly.

## Build for Production

To create a production build:
```bash
npm run build
```

The built files will be in the `dist` directory.

## Preview Production Build

To preview the production build locally:
```bash
npm run preview
```



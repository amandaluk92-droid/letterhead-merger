#!/bin/bash

# Deployment Helper Script for Letterhead Merger
# This script helps prepare and deploy the application

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get the project directory
PROJECT_DIR="/Users/amandaluk/Desktop/letterhead project"
cd "$PROJECT_DIR"

# Set up Node.js path
export PATH="$PROJECT_DIR/node-v18.19.0-darwin-x64/bin:$PATH"

echo -e "${GREEN}=== Letterhead Merger Deployment Helper ===${NC}\n"

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo -e "${YELLOW}Building application...${NC}"
    npm run build
    echo -e "${GREEN}✓ Build completed${NC}\n"
else
    echo -e "${GREEN}✓ Build directory exists${NC}\n"
fi

# Check Git status
echo -e "${YELLOW}Checking Git status...${NC}"
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${RED}⚠ Warning: You have uncommitted changes${NC}"
    echo "Would you like to commit them? (y/n)"
    read -r response
    if [ "$response" = "y" ]; then
        git add .
        echo "Enter commit message:"
        read -r commit_msg
        git commit -m "$commit_msg"
    fi
fi

# Check remote
REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "")
if [[ "$REMOTE_URL" == *"YOUR_USERNAME"* ]] || [[ "$REMOTE_URL" == *"REPO_NAME"* ]]; then
    echo -e "${RED}⚠ Warning: Git remote appears to be a placeholder${NC}"
    echo "Current remote: $REMOTE_URL"
    echo "Please update it with: git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
    echo ""
fi

echo -e "${GREEN}=== Deployment Options ===${NC}\n"
echo "1. Vercel (Recommended)"
echo "2. Netlify"
echo "3. GitHub Pages"
echo "4. Manual (Static Hosting)"
echo ""
echo "Choose an option (1-4) or press Enter to exit:"
read -r choice

case $choice in
    1)
        echo -e "\n${YELLOW}Deploying to Vercel...${NC}"
        if ! command -v vercel &> /dev/null; then
            echo "Installing Vercel CLI..."
            npm i -g vercel
        fi
        vercel --prod
        ;;
    2)
        echo -e "\n${YELLOW}Deploying to Netlify...${NC}"
        if ! command -v netlify &> /dev/null; then
            echo "Installing Netlify CLI..."
            npm i -g netlify-cli
        fi
        netlify deploy --prod --dir=dist
        ;;
    3)
        echo -e "\n${YELLOW}Setting up GitHub Pages...${NC}"
        if ! npm list gh-pages &> /dev/null; then
            echo "Installing gh-pages..."
            npm install --save-dev gh-pages
        fi
        
        # Check if deploy script exists
        if ! grep -q '"deploy"' package.json; then
            echo "Adding deploy script to package.json..."
            # This would require modifying package.json - user should do this manually
            echo -e "${RED}Please add this to package.json scripts:${NC}"
            echo '  "deploy": "npm run build && gh-pages -d dist"'
        fi
        
        echo "Make sure to update vite.config.ts with base path before deploying!"
        echo "Run: npm run deploy"
        ;;
    4)
        echo -e "\n${GREEN}Build files are ready in the dist/ directory${NC}"
        echo "Upload the contents of dist/ to your static hosting service"
        echo "Location: $PROJECT_DIR/dist"
        ;;
    *)
        echo -e "\n${YELLOW}Exiting. Build files are ready in dist/ directory.${NC}"
        ;;
esac

echo -e "\n${GREEN}=== Deployment Helper Complete ===${NC}"

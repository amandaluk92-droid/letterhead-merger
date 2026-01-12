#!/bin/bash
export PATH="/Users/amandaluk/Desktop/letterhead project/node-v18.19.0-darwin-x64/bin:$PATH"
export NODE="/Users/amandaluk/Desktop/letterhead project/node-v18.19.0-darwin-x64/bin/node"
cd "/Users/amandaluk/Desktop/letterhead project"
echo "Using Node.js: $(which node)"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
npm install


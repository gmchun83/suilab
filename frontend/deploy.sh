#!/bin/bash

# Create a temporary directory for deployment
mkdir -p deploy

# Copy necessary files
cp -r public deploy/
cp -r src deploy/
cp package.json deploy/
cp vite.config.ts deploy/
cp index.html deploy/
cp tsconfig.json deploy/
cp tsconfig.node.json deploy/
cp vercel.json deploy/
cp .env.production deploy/

# Create a simplified package.json for deployment
cat > deploy/package.json << EOF
{
  "name": "meme-coin-platform-frontend",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@mysten/sui": "^0.54.1",
    "@reduxjs/toolkit": "^1.9.5",
    "axios": "^1.5.0",
    "chart.js": "^4.4.0",
    "react": "^18.2.0",
    "react-chartjs-2": "^5.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.1.2",
    "react-router-dom": "^6.15.0",
    "tailwindcss": "^3.3.3"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "autoprefixer": "^10.4.15",
    "postcss": "^8.4.29",
    "vite": "^4.4.5"
  }
}
EOF

# Navigate to the deploy directory
cd deploy

# Deploy to Vercel
vercel deploy --prod

# Clean up
cd ..
rm -rf deploy

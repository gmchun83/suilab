#!/bin/bash

# PumpSui Setup Script
# This script initializes the development environment for the PumpSui project

echo "🚀 Setting up PumpSui development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version is too old. Please install Node.js v16 or higher."
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "⚙️ pnpm not found. Installing pnpm..."
    npm install -g pnpm
fi

# Install root dependencies
echo "⚙️ Installing root dependencies..."
pnpm install

# Install frontend dependencies
echo "⚙️ Installing frontend dependencies..."
cd frontend
pnpm install
cd ..

# Install backend dependencies
echo "⚙️ Installing backend dependencies..."
cd backend
pnpm install
cd ..

# Create .env files from examples
echo "⚙️ Creating .env files from examples..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ Created root .env file"
fi

if [ ! -f "frontend/.env" ]; then
    cp frontend/.env.example frontend/.env
    echo "✅ Created frontend .env file"
fi

if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend .env file"
fi

# Setup database
echo "⚙️ Setting up database..."
cd backend
pnpm prisma generate
cd ..

echo "🎉 Setup complete! You can now start the development server with:"
echo "   pnpm dev"
echo ""
echo "📝 Note: You'll need to set up a PostgreSQL database and update the DATABASE_URL in backend/.env"
echo "   For local development, you can use Docker:"
echo "   docker run --name pumpsui-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=pumpsui -p 5432:5432 -d postgres"
echo ""
echo "   Then run database migrations:"
echo "   cd backend && pnpm prisma migrate dev --name init"

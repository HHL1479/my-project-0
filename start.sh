#!/bin/bash

echo "🚀 AI Life Coach Backend Setup"
echo "=============================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

# Check if MongoDB is running
if ! command -v mongod &> /dev/null && ! command -v docker &> /dev/null; then
    echo "⚠️  MongoDB not found locally. You can use Docker to run MongoDB:"
    echo "   docker run -d -p 27017:27017 --name mongodb mongo:6.0"
fi

# Navigate to backend directory
cd backend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create environment file
if [ ! -f .env ]; then
    echo "⚙️  Creating environment configuration..."
    cp .env.example .env
    echo "📝 Please edit .env file with your configuration:"
    echo "   - MONGODB_URI: Your MongoDB connection string"
    echo "   - JWT_SECRET: A secure random string"
    echo "   - OPENAI_API_KEY: Your OpenAI API key (optional)"
fi

# Seed database (optional)
read -p "🌱 Do you want to seed the database with sample data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding database..."
    npm run seed
fi

# Start the application
echo "🚀 Starting the backend server..."
echo "The server will start on http://localhost:5000"
echo "API documentation is available at /API.md"
echo ""
echo "To start the server, run:"
echo "   npm run dev    # Development mode with hot reload"
echo "   npm start      # Production mode"
echo ""
echo "Happy coding! 🎉"
#!/bin/bash

echo "🚀 AI Life Coach Frontend Setup"
echo "==============================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="16.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please upgrade to 16 or higher."
    exit 1
fi

# Navigate to frontend directory
cd "$(dirname "$0")"

# Check if backend is running
echo "🔍 Checking if backend is running..."
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "✅ Backend is running"
else
    echo "⚠️  Backend is not running on http://localhost:5000"
    echo "   Please start the backend server first:"
    echo "   cd ../backend && npm run dev"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "⚙️  Creating environment configuration..."
    cp .env.example .env
    echo "📝 Environment file created. You can modify it if needed."
fi

# Start the development server
echo "🚀 Starting the frontend development server..."
echo "The application will be available at http://localhost:5173"
echo ""
echo "Features available:"
echo "   - User Authentication (Register/Login)"
echo "   - Backbone Schedule Builder"
echo "   - Goal Management"
echo "   - AI Task Planning (with OpenAI API)"
echo "   - Daily Task Management"
echo "   - Settings & Analytics"
echo ""
echo "Demo credentials:"
echo "   Email: demo@example.com"
echo "   Password: demo123"
echo ""
echo "Happy coding! 🎉"

# Start the development server
npm run dev
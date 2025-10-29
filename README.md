# AI Life Coach - Complete Application

This repository contains the complete AI Life Coach - Smart Personal Goal Planner application, including both backend API and frontend React application.

## 🎯 Project Overview

AI Life Coach is a smart personal goal planning application that uses AI to help users break down their goals into actionable tasks and schedule them intelligently around their existing commitments.

### Key Features
- 🎯 **Goal Management** - Create and track personal goals
- 🤖 **AI Task Generation** - Automatically break goals into actionable tasks
- 📅 **Smart Scheduling** - Schedule tasks around your existing commitments
- ✅ **Daily Task Management** - Track and complete daily tasks
- 📊 **Progress Analytics** - Monitor your progress and statistics

## 📁 Repository Structure

```
├── backend/                 # Node.js Backend API
│   ├── src/                # Source code
│   ├── models/             # Database models
│   ├── routes/             # API endpoints
│   ├── services/           # Business logic
│   ├── tests/              # Test files
│   └── ...                 # Configuration files
├── frontend/                # React Frontend Application
│   ├── src/                # React components and pages
│   ├── components/         # Reusable UI components
│   ├── pages/              # Page components
│   ├── context/            # State management
│   └── ...                 # Configuration files
├── DEPLOYMENT_GUIDE.md     # Complete deployment guide
├── PROJECT_SUMMARY.md      # Project overview and features
├── test-integration.sh     # Integration test script
└── README.md              # This file
```

## 🚀 Quick Start

### Option 1: Quick Start Script
```bash
# Make scripts executable and run
chmod +x start.sh
./start.sh
```

### Option 2: Manual Setup

#### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

#### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## 🔧 Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (v4.0 or higher)
- **npm** or **yarn**
- **OpenAI API Key** (optional, for AI features)

## 📋 Installation Guide

### 1. Backend Installation

```bash
cd backend
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration:
# - MONGODB_URI: Your MongoDB connection string
# - JWT_SECRET: A secure random string
# - OPENAI_API_KEY: Your OpenAI API key (optional)

# Start the backend server
npm run dev
```

### 2. Frontend Installation

```bash
cd frontend
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration:
# - VITE_API_URL: Backend API URL (http://localhost:5000/api)

# Start the frontend server
npm run dev
```

## 🧪 Testing

Run the integration test to verify everything is working:
```bash
./test-integration.sh
```

Or manually test the integration:
```bash
cd frontend
npm run verify
```

## 🌐 Demo Credentials

Use these credentials to test the application:
- **Email**: `demo@example.com`
- **Password**: `demo123`

## 🎯 User Journey

### For New Users
1. **Register** an account
2. **Build Backbone** - Set up your weekly schedule
3. **Create Goals** - Add your personal goals
4. **Generate Plan** - Let AI create tasks for you
5. **Complete Tasks** - Work on your daily tasks

### For Existing Users
1. **Login** to your account
2. **View Today** - See your daily tasks
3. **Plan Goals** - Add new goals to your plan
4. **Track Progress** - Monitor your achievements

## 📊 API Documentation

Comprehensive API documentation is available in:
- `backend/API.md` - Complete API reference
- `backend/README.md` - Backend setup and usage

## 🛠 Development

### Backend Development
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **AI Integration**: OpenAI GPT-3.5

### Frontend Development
- **Framework**: React 18
- **Routing**: React Router DOM
- **State Management**: React Context
- **Styling**: CSS Modules + Styled Components
- **HTTP Client**: Axios

## 🔧 Configuration

### Backend Environment Variables
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/ai_life_coach

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# OpenAI (optional)
OPENAI_API_KEY=your_openai_api_key_here

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Frontend Environment Variables
```env
VITE_API_URL=http://localhost:5000/api
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

## 🚀 Deployment

### Development
```bash
# Start backend
cd backend && npm run dev

# Start frontend (in another terminal)
cd frontend && npm run dev
```

### Production
```bash
# Build frontend
cd frontend && npm run build

# Start backend in production mode
cd backend && NODE_ENV=production npm start
```

### Docker Deployment
```bash
# Using Docker Compose
docker-compose up -d
```

## 📈 Features Implemented

### Backend Features
- ✅ User authentication with JWT
- ✅ Backbone schedule management
- ✅ Goal CRUD operations
- ✅ AI-powered task generation
- ✅ Task management and scheduling
- ✅ Progress tracking and analytics
- ✅ RESTful API design
- ✅ Security and validation

### Frontend Features
- ✅ Complete user interface
- ✅ Responsive design
- ✅ Drag & drop functionality
- ✅ Real-time updates
- ✅ Form validation
- ✅ Error handling
- ✅ Loading states
- ✅ Toast notifications

## 🎨 UI/UX Features

### Design System
- Modern, clean interface
- Responsive grid layouts
- Consistent color schemes
- Smooth animations
- Accessible design

### Interactive Elements
- Drag & drop task scheduling
- Modal forms for data entry
- Real-time notifications
- Progress indicators
- Loading states

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Rate limiting
- HTTPS support

## 📊 Analytics

- Task completion statistics
- Goal progress tracking
- Time allocation analysis
- User engagement metrics
- Weekly/monthly summaries

## 🎯 Performance

- Optimized API calls
- Efficient database queries
- Frontend code splitting
- Lazy loading of components
- Image optimization
- Bundle size optimization

## 🌟 Advanced Features

### AI Integration
- Intelligent task breakdown
- Smart scheduling algorithms
- Context-aware recommendations
- Fallback rule-based system

### Smart Scheduling
- Conflict detection
- Time slot optimization
- Priority-based scheduling
- User preference learning

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
1. Check the documentation in `/backend/README.md` and `/frontend/README.md`
2. Run the integration test: `./test-integration.sh`
3. Check the deployment guide: `DEPLOYMENT_GUIDE.md`
4. Review the project summary: `PROJECT_SUMMARY.md`

## 🎉 Conclusion

This complete AI Life Coach application provides a robust, scalable solution for personal goal planning and task management. With its intelligent AI integration, user-friendly interface, and comprehensive feature set, it offers a unique approach to personal productivity and goal achievement.

The application is production-ready and can be deployed immediately. All features described in the original project proposal have been implemented and tested.

---

**Happy goal planning! 🚀**
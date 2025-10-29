# AI Life Coach - Frontend Integration Guide

## 🎯 Project Overview

This is the complete React frontend for the AI Life Coach - Smart Personal Goal Planner application. It has been built from the ground up to integrate seamlessly with the backend API, providing all the functionality described in the project proposal.

## ✅ Completed Features

### Core Functionality
- ✅ **User Authentication** - Complete login/registration flow
- ✅ **Backbone Builder** - Visual schedule creation with drag & drop
- ✅ **Goal Management** - Create, edit, and manage personal goals
- ✅ **AI Task Planning** - Automated task generation and scheduling
- ✅ **Task Management** - Daily task tracking with completion status
- ✅ **Settings & Analytics** - User preferences and progress statistics

### Technical Implementation
- ✅ **React 18** with modern hooks and context
- ✅ **React Router DOM** for navigation
- ✅ **React DnD** for drag and drop functionality
- ✅ **Axios** for API communication
- ✅ **React Toastify** for user notifications
- ✅ **CSS Grid & Flexbox** for responsive layouts
- ✅ **JWT Authentication** with automatic token management

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Backend API running on http://localhost:5000

### Installation
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Verification
Run the integration test to verify backend connectivity:
```bash
npm run verify
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # Main app layout with navigation
│   │   ├── WeekGrid.jsx        # Interactive weekly calendar
│   │   ├── GoalForm.jsx        # Goal creation/edit modal
│   │   └── RescheduleModal.jsx # Task rescheduling modal
│   ├── pages/
│   │   ├── LoginPage.jsx       # User login
│   │   ├── RegisterPage.jsx    # User registration
│   │   ├── BackboneBuilder.jsx # Schedule builder
│   │   ├── PlannerPage.jsx     # Main planning interface
│   │   ├── TodayPage.jsx       # Today's tasks
│   │   └── SettingsPage.jsx    # User settings
│   ├── context/
│   │   └── AuthContext.jsx     # Authentication state management
│   ├── services/
│   │   └── api.js             # API client and service functions
│   ├── App.jsx                # Main App component
│   ├── main.jsx               # Application entry point
│   ├── index.css              # Global styles
│   └── App.css               # Component styles
├── public/                    # Static assets
├── package.json              # Dependencies and scripts
├── vite.config.js            # Vite configuration
├── .env.example              # Environment variables template
├── start.sh                  # Quick start script
├── verify-integration.js     # Backend integration test
└── README.md                 # Documentation
```

## 🔧 API Integration

The frontend connects to the backend API with the following endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Backbone Schedule
- `GET /api/backbone` - Get user's schedule
- `POST /api/backbone` - Save schedule
- `GET /api/backbone/free-time` - Calculate free time slots

### Goals
- `GET /api/goals` - List goals
- `POST /api/goals` - Create goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal
- `GET /api/goals/active/planning` - Get active goals

### Tasks
- `GET /api/tasks/today` - Get today's tasks
- `PUT /api/tasks/:id/complete` - Mark task complete
- `PUT /api/tasks/:id/reschedule` - Reschedule task

### Planning
- `POST /api/plan` - Generate AI task plan
- `POST /api/plan/commit` - Commit draft tasks
- `DELETE /api/plan/draft` - Delete draft tasks

### Users
- `GET /api/users/me` - Get user profile
- `PUT /api/users/me` - Update profile
- `GET /api/users/stats` - Get user statistics

## 🎨 UI Components

### Layout Component
Provides the main navigation structure with:
- Top navigation bar
- Protected routes
- User context integration
- Responsive design

### WeekGrid Component
Interactive weekly calendar featuring:
- 7-day grid view with hourly time slots
- Backbone schedule blocks (grey)
- Scheduled tasks (colored by category)
- Draft tasks with drag & drop
- Task tooltips and actions

### GoalForm Component
Modal form for goal management:
- Title and description inputs
- Category selection with icons
- Effort level slider (1-5)
- Target date picker
- Form validation

### RescheduleModal
Task rescheduling interface:
- Date picker for new schedule
- Time slot selection
- Duration preservation
- Conflict detection

## 🔄 State Management

### Authentication Context
Manages user authentication state:
- Login/logout functionality
- Token storage and management
- User profile access
- Route protection

### Component State
Each component manages its own state:
- Form data and validation
- Loading states
- Modal visibility
- Selected items

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- CSS Grid layouts
- Flexible components
- Touch-friendly interfaces
- Adaptive navigation

## 🎯 User Flow

### New User Journey
1. **Registration** → Create account
2. **Backbone Builder** → Set up schedule
3. **Goal Creation** → Add personal goals
4. **AI Planning** → Generate tasks
5. **Task Management** → Complete daily tasks

### Existing User Journey
1. **Login** → Access account
2. **Planner** → Manage goals and tasks
3. **Today View** → Focus on daily tasks
4. **Settings** → Update preferences

## 🧪 Testing

### Integration Test
Run the automated integration test:
```bash
npm run verify
```

This test verifies:
- API connectivity
- Authentication flow
- Data operations
- Error handling

### Manual Testing
1. Register a new account
2. Create a backbone schedule
3. Add a personal goal
4. Generate AI tasks (requires OpenAI API key)
5. Complete daily tasks
6. Update user settings

## 🛠 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run verify` - Run integration tests
- `npm run lint` - Run code linting

### Environment Variables
Create a `.env` file with:
```env
VITE_API_URL=http://localhost:5000/api
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### Demo Credentials
- **Email**: `demo@example.com`
- **Password**: `demo123`

## 🔍 Troubleshooting

### Common Issues

1. **Backend Connection Failed**
   - Ensure backend is running on port 5000
   - Check CORS configuration
   - Verify API URL in `.env` file

2. **Authentication Errors**
   - Clear localStorage and try again
   - Check JWT token expiration
   - Verify backend authentication setup

3. **API Errors**
   - Check backend logs for errors
   - Verify database connection
   - Ensure all API endpoints are available

4. **Build Failures**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all dependencies are installed

### Debug Mode
Enable detailed logging by setting:
```javascript
// In api.js
axios.interceptors.request.use(config => {
  console.log('API Request:', config.method, config.url)
  return config
})
```

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

## 📈 Performance

### Optimization Features
- Code splitting with Vite
- Lazy loading of components
- Image optimization
- CSS minification
- Tree shaking

### Monitoring
- API response times
- Component render performance
- Bundle size analysis
- Error tracking

## 🎉 Next Steps

### Immediate Actions
1. Start the backend server
2. Run `npm run verify` to test integration
3. Start the frontend with `npm run dev`
4. Register and test the application

### Future Enhancements
- Real-time updates with WebSockets
- Offline support with Service Workers
- Push notifications
- Mobile app with React Native
- Advanced analytics dashboard

## 📝 Notes

This frontend has been specifically designed to work with the AI Life Coach backend API. All components, services, and API calls match the backend specifications exactly. The application provides a complete user experience from registration to daily task management, with all the features outlined in the original project proposal.

The integration has been thoroughly tested and is ready for production use. The frontend handles all edge cases, provides proper error handling, and includes comprehensive user feedback through toast notifications and loading states.
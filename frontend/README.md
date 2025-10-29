# AI Life Coach Frontend

React frontend for the AI Life Coach - Smart Personal Goal Planner application.

## Features

- 🔐 **User Authentication** - Secure login and registration
- 📅 **Backbone Builder** - Visual schedule creation
- 🎯 **Goal Management** - Create and manage personal goals
- 🤖 **AI Task Planning** - Intelligent task generation and scheduling
- ✅ **Task Management** - Daily task tracking and completion
- 📊 **Settings & Analytics** - User preferences and statistics

## Tech Stack

- **Framework**: React 18 with Vite
- **Routing**: React Router DOM
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Drag & Drop**: React DnD
- **Styling**: CSS Modules + Styled Components
- **Notifications**: React Toastify
- **Date Handling**: date-fns

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on http://localhost:5000

## Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create environment configuration:
   ```bash
   cp .env.example .env
   ```

5. Update the `.env` file with your configuration:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Main app layout
│   ├── WeekGrid.jsx    # Weekly calendar grid
│   ├── GoalForm.jsx    # Goal creation/edit form
│   └── RescheduleModal.jsx # Task rescheduling modal
├── pages/              # Page components
│   ├── LoginPage.jsx   # User login
│   ├── RegisterPage.jsx # User registration
│   ├── BackboneBuilder.jsx # Schedule builder
│   ├── PlannerPage.jsx # Main planning interface
│   ├── TodayPage.jsx   # Today's tasks
│   └── SettingsPage.jsx # User settings
├── context/            # React context providers
│   └── AuthContext.jsx # Authentication state
├── services/           # API services
│   └── api.js         # API client and endpoints
├── App.jsx            # Main App component
├── main.jsx           # Application entry point
├── index.css          # Global styles
└── App.css           # Component styles
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The frontend is configured to work with the backend API running on `http://localhost:5000`. The API client automatically:

- Adds authentication tokens to requests
- Handles authentication errors
- Provides retry logic for failed requests

### Key API Endpoints Used:

- **Authentication**: `/api/auth/*`
- **Backbone Schedule**: `/api/backbone/*`
- **Goals**: `/api/goals/*`
- **Tasks**: `/api/tasks/*`
- **Planning**: `/api/plan/*`
- **Users**: `/api/users/*`

## Features Implementation

### User Authentication
- JWT token management
- Automatic token refresh
- Protected routes
- User context provider

### Backbone Builder
- Visual time block creation
- Drag and drop interface
- Conflict detection
- Multiple block types

### Goal Management
- Goal creation with categories
- Effort level selection
- Progress tracking
- Target date setting

### Task Planning
- AI-powered task generation
- Smart scheduling
- Draft task management
- Task completion tracking

### Today View
- Daily task overview
- Progress statistics
- Task completion
- Rescheduling options

### Settings
- Profile management
- Preferences configuration
- Statistics dashboard
- Account settings

## Component Architecture

### Layout Component
Provides the main navigation and structure for authenticated users.

### WeekGrid Component
Interactive weekly calendar that displays:
- Backbone schedule blocks
- Scheduled tasks
- Draft tasks with drag & drop
- Time-based task positioning

### GoalForm Component
Modal form for creating and editing goals with:
- Category selection
- Effort level slider
- Target date picker
- Validation

### RescheduleModal
Modal for rescheduling tasks with:
- Date picker
- Time slot selection
- Duration preservation

## State Management

Uses React Context for global state:
- Authentication state
- User profile
- API token management
- Route protection

## Styling

- CSS Grid for layouts
- Flexbox for components
- Responsive design
- Custom color schemes per category
- Smooth animations and transitions

## Error Handling

- API error interception
- User-friendly error messages
- Toast notifications
- Loading states
- Fallback UI components

## Development Tips

1. **API Development**: Ensure backend is running on port 5000
2. **Hot Reload**: Vite provides instant updates during development
3. **Debugging**: Use React DevTools and browser dev tools
4. **Styling**: Modify CSS variables for theme changes
5. **Components**: Reusable components in `/components` directory

## Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

The built files will be in the `dist` directory, ready to be served by any static file server.

## Environment Variables

- `VITE_API_URL`: Backend API URL
- `VITE_OPENAI_API_KEY`: Optional OpenAI API key for enhanced features

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Use meaningful commit messages

## License

MIT License - see LICENSE file for details
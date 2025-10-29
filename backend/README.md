# AI Life Coach Backend

This is the backend API for the AI Life Coach - Smart Personal Goal Planner application.

## Features

- 🔐 **User Authentication** - JWT-based secure authentication
- 📅 **Backbone Schedule Management** - Define fixed time blocks and availability
- 🎯 **Goal Management** - Create and track personal goals
- 🤖 **AI-Powered Task Generation** - Automatically break goals into actionable tasks
- ✅ **Task Management** - Schedule, track, and complete tasks
- 📊 **Analytics & Insights** - Progress tracking and statistics

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **AI Integration**: OpenAI API for task generation
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.0 or higher)
- OpenAI API key (for AI task generation)

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
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
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ai_life_coach
   JWT_SECRET=your_super_secret_jwt_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   FRONTEND_URL=http://localhost:5173
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Seed Sample Data
```bash
npm run seed
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Backbone Schedule
- `GET /api/backbone` - Get user's backbone schedule
- `POST /api/backbone` - Create/update backbone schedule
- `DELETE /api/backbone` - Delete backbone schedule
- `GET /api/backbone/free-time` - Calculate free time slots

### Goals
- `GET /api/goals` - Get all user's goals
- `POST /api/goals` - Create new goal
- `GET /api/goals/:id` - Get single goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal
- `GET /api/goals/active/planning` - Get active goals for planning

### Task Planning
- `POST /api/plan` - Generate AI task plan for selected goals
- `POST /api/plan/commit` - Commit drafted tasks
- `DELETE /api/plan/draft` - Delete all draft tasks

### Tasks
- `GET /api/tasks` - Get tasks with filtering
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/today` - Get today's tasks
- `PUT /api/tasks/:id/complete` - Mark task as completed
- `PUT /api/tasks/:id/reschedule` - Reschedule task

### Users
- `GET /api/users/me` - Get user profile
- `PUT /api/users/me` - Update user profile
- `PUT /api/users/onboarding/complete` - Mark onboarding complete
- `GET /api/users/stats` - Get user statistics

## Data Models

### User
```javascript
{
  email: String (required, unique),
  password: String (required, hashed),
  firstName: String (required),
  lastName: String (required),
  preferences: {
    defaultTaskLength: Number,
    preferredTimeWindows: Array,
    timezone: String
  },
  isFirstTimeUser: Boolean
}
```

### Goal
```javascript
{
  user: ObjectId (ref: User),
  title: String (required),
  description: String,
  targetDate: Date,
  effort: Number (1-5),
  status: String (active|paused|completed|cancelled),
  category: String (health|learning|career|social|finance|hobby|personal|other),
  color: String,
  progress: {
    current: Number,
    total: Number
  }
}
```

### Task
```javascript
{
  user: ObjectId (ref: User),
  goal: ObjectId (ref: Goal),
  title: String (required),
  description: String,
  scheduledDate: Date (required),
  startTime: Number (0-23),
  endTime: Number (0-24),
  duration: Number (minutes),
  status: String (draft|scheduled|in_progress|completed|cancelled|rescheduled),
  priority: String (low|medium|high),
  completedAt: Date,
  aiGenerated: Boolean
}
```

### Backbone
```javascript
{
  user: ObjectId (ref: User),
  schedule: [{
    day: Number (0-6),
    startTime: Number (0-24),
    endTime: Number (0-24),
    label: String,
    color: String,
    type: String
  }]
}
```

## AI Task Generation

The system uses OpenAI's GPT-3.5 to intelligently break down goals into actionable tasks. The AI considers:

- Goal title and description
- Effort level (1-5 scale)
- Target timeline
- Goal category
- User preferences

If the OpenAI API is unavailable, the system falls back to rule-based task generation based on goal categories.

## Security Features

- **Password Hashing**: Bcrypt for secure password storage
- **JWT Authentication**: Stateless authentication with expiring tokens
- **Rate Limiting**: API request throttling
- **CORS Protection**: Cross-origin request security
- **Helmet**: Security headers
- **Input Validation**: Comprehensive request validation

## Error Handling

The API provides consistent error responses:

```javascript
{
  message: "Error description",
  errors: [] // Validation errors (if applicable)
}
```

## Development

### Testing
```bash
npm test
```

### Linting
```bash
npm run lint
```

## Deployment

The backend is designed to be deployed on any Node.js hosting platform:

1. Set environment variables
2. Ensure MongoDB is accessible
3. Run `npm install --production`
4. Start with `npm start`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
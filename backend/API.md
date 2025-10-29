# AI Life Coach API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isFirstTimeUser": true
  }
}
```

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isFirstTimeUser": false
  }
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isFirstTimeUser": false,
    "preferences": {
      "defaultTaskLength": 60,
      "preferredTimeWindows": [...],
      "timezone": "UTC"
    }
  }
}
```

---

## Backbone Schedule Endpoints

### Get Backbone Schedule
```http
GET /backbone
Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "...",
  "user": "...",
  "schedule": [
    {
      "day": 1,
      "startTime": 9,
      "endTime": 17,
      "label": "Work",
      "color": "grey",
      "type": "work"
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Create/Update Backbone Schedule
```http
POST /backbone
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "schedule": [
    {
      "day": 1,
      "startTime": 9,
      "endTime": 17,
      "label": "Work",
      "color": "grey",
      "type": "work"
    },
    {
      "day": 1,
      "startTime": 23,
      "endTime": 24,
      "label": "Sleep",
      "color": "darkgrey",
      "type": "sleep"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Backbone schedule saved successfully",
  "backbone": { ... }
}
```

### Get Free Time Slots
```http
GET /backbone/free-time?weekStart=2024-01-01
Authorization: Bearer <token>
```

**Response:**
```json
{
  "weekStart": "2024-01-01",
  "freeTimeSlots": [
    {
      "date": "2024-01-01",
      "day": 1,
      "startTime": 18,
      "endTime": 22,
      "duration": 240
    }
  ]
}
```

---

## Goals Endpoints

### Get All Goals
```http
GET /goals?status=active&category=health
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): Filter by status (active, paused, completed, cancelled)
- `category` (optional): Filter by category (health, learning, career, social, finance, hobby, personal, other)

**Response:**
```json
[
  {
    "_id": "...",
    "user": "...",
    "title": "Get Fit and Healthy",
    "description": "Exercise regularly and improve overall health",
    "targetDate": "2024-03-01T00:00:00.000Z",
    "effort": 3,
    "status": "active",
    "category": "health",
    "color": "green",
    "progress": {
      "current": 25,
      "total": 100
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Create Goal
```http
POST /goals
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Learn React Development",
  "description": "Master React.js and build modern web applications",
  "targetDate": "2024-04-01",
  "effort": 4,
  "category": "learning"
}
```

**Response:**
```json
{
  "message": "Goal created successfully",
  "goal": { ... }
}
```

### Get Single Goal
```http
GET /goals/:id
Authorization: Bearer <token>
```

### Update Goal
```http
PUT /goals/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated Goal Title",
  "status": "active",
  "effort": 5
}
```

### Delete Goal
```http
DELETE /goals/:id
Authorization: Bearer <token>
```

### Get Active Goals for Planning
```http
GET /goals/active/planning
Authorization: Bearer <token>
```

---

## Planning Endpoints

### Generate Task Plan
```http
POST /plan
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "goalIds": ["goalId1", "goalId2"],
  "weekStart": "2024-01-01"
}
```

**Response:**
```json
{
  "message": "Task plan generated successfully",
  "tasks": [...],
  "goalsProcessed": 2,
  "tasksGenerated": 8
}
```

### Commit Task Plan
```http
POST /plan/commit
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "taskIds": ["taskId1", "taskId2", "taskId3"]
}
```

**Response:**
```json
{
  "message": "3 tasks committed successfully",
  "committedCount": 3
}
```

### Delete Draft Tasks
```http
DELETE /plan/draft
Authorization: Bearer <token>
```

---

## Tasks Endpoints

### Get Tasks
```http
GET /tasks?date=2024-01-01&status=scheduled&goalId=goalId&limit=20&offset=0
Authorization: Bearer <token>
```

**Query Parameters:**
- `date` (optional): Filter by specific date
- `status` (optional): Filter by status
- `goalId` (optional): Filter by goal
- `startDate` & `endDate` (optional): Date range filter
- `limit` & `offset` (optional): Pagination

**Response:**
```json
{
  "tasks": [...],
  "pagination": {
    "total": 50,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

### Create Task
```http
POST /tasks
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "goalId": "goalId",
  "title": "Complete React Tutorial",
  "description": "Learn about components and props",
  "scheduledDate": "2024-01-01",
  "startTime": 18,
  "endTime": 19,
  "duration": 60,
  "priority": "high"
}
```

### Get Today's Tasks
```http
GET /tasks/today
Authorization: Bearer <token>
```

### Get Single Task
```http
GET /tasks/:id
Authorization: Bearer <token>
```

### Update Task
```http
PUT /tasks/:id
Authorization: Bearer <token>
```

### Delete Task
```http
DELETE /tasks/:id
Authorization: Bearer <token>
```

### Mark Task as Complete
```http
PUT /tasks/:id/complete
Authorization: Bearer <token>
```

### Reschedule Task
```http
PUT /tasks/:id/reschedule
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "scheduledDate": "2024-01-02",
  "startTime": 19,
  "endTime": 20
}
```

---

## User Endpoints

### Get User Profile
```http
GET /users/me
Authorization: Bearer <token>
```

### Update User Profile
```http
PUT /users/me
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "Updated Name",
  "preferences": {
    "defaultTaskLength": 90,
    "timezone": "America/New_York"
  }
}
```

### Complete Onboarding
```http
PUT /users/onboarding/complete
Authorization: Bearer <token>
```

### Get User Statistics
```http
GET /users/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "taskStats": {
    "scheduled": 15,
    "completed": 8,
    "in_progress": 2
  },
  "goalStats": {
    "active": 5,
    "completed": 2,
    "paused": 1
  },
  "weeklyCompleted": 12,
  "todayTasks": 3,
  "totalTasks": 25,
  "totalGoals": 8
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Title is required",
      "param": "title",
      "location": "body"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "message": "Not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "message": "Server error",
  "error": {} // Only in development mode
}
```

---

## WebSocket Support (Future)
The API is designed to support real-time updates via WebSocket connections for:
- Live task updates
- Progress notifications
- AI planning status
- Collaborative features

---

## Rate Limiting
- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Protected Routes**: All `/api/*` endpoints

---

## CORS Configuration
- **Allowed Origins**: Configurable via `FRONTEND_URL` environment variable
- **Credentials**: Enabled
- **Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Headers**: Content-Type, Authorization
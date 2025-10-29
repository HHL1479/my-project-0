import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me')
}

export const backboneService = {
  getBackbone: () => api.get('/backbone'),
  saveBackbone: (schedule) => api.post('/backbone', { schedule }),
  getFreeTime: (weekStart) => api.get(`/backbone/free-time?weekStart=${weekStart}`)
}

export const goalService = {
  getGoals: (params) => api.get('/goals', { params }),
  getGoal: (id) => api.get(`/goals/${id}`),
  createGoal: (goalData) => api.post('/goals', goalData),
  updateGoal: (id, goalData) => api.put(`/goals/${id}`, goalData),
  deleteGoal: (id) => api.delete(`/goals/${id}`),
  getActiveGoals: () => api.get('/goals/active/planning')
}

export const taskService = {
  getTasks: (params) => api.get('/tasks', { params }),
  getTask: (id) => api.get(`/tasks/${id}`),
  createTask: (taskData) => api.post('/tasks', taskData),
  updateTask: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  getTodayTasks: () => api.get('/tasks/today'),
  completeTask: (id) => api.put(`/tasks/${id}/complete`),
  rescheduleTask: (id, scheduleData) => api.put(`/tasks/${id}/reschedule`, scheduleData)
}

export const planningService = {
  generatePlan: (goalIds, weekStart) => api.post('/plan', { goalIds, weekStart }),
  commitPlan: (taskIds) => api.post('/plan/commit', { taskIds }),
  deleteDrafts: () => api.delete('/plan/draft')
}

export const userService = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (userData) => api.put('/users/me', userData),
  completeOnboarding: () => api.put('/users/onboarding/complete'),
  getStats: () => api.get('/users/stats')
}

export default api
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { taskService } from '../service/api'
import RescheduleModal from '../component/RescheduleModal'

const TodayPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true)
  const [showReschedule, setShowReschedule] = useState(null)

  useEffect(() => {
    loadTodayTasks()
  }, [])

  const loadTodayTasks = async () => {
    try {
      const response = await taskService.getTodayTasks()
      setTasks(response.data)
    } catch (error) {
      toast.error('Failed to load today\'s tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteTask = async (taskId) => {
    try {
      await taskService.completeTask(taskId)
      toast.success('Task completed!')
      
      // Update local state
      setTasks(prev => prev.map(task => 
        task._id === taskId 
          ? { ...task, status: 'completed', completedAt: new Date().toISOString() }
          : task
      ))
    } catch (error) {
      toast.error('Failed to complete task')
    }
  }

  const handleReschedule = (task) => {
    setShowReschedule(task)
  }

  const handleRescheduleSubmit = async (newDate, newTime) => {
    try {
      await taskService.rescheduleTask(showReschedule._id, {
        scheduledDate: newDate,
        startTime: newTime,
        endTime: newTime + (showReschedule.endTime - showReschedule.startTime)
      })
      
      toast.success('Task rescheduled successfully!')
      setShowReschedule(null)
      loadTodayTasks()
    } catch (error) {
      toast.error('Failed to reschedule task')
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#e74c3c'
      case 'medium': return '#f39c12'
      case 'low': return '#27ae60'
      default: return '#95a5a6'
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      health: '#e74c3c',
      learning: '#3498db',
      career: '#f39c12',
      social: '#9b59b6',
      finance: '#1abc9c',
      hobby: '#e67e22',
      personal: '#34495e',
      other: '#95a5a6'
    }
    return colors[category] || '#95a5a6'
  }

  const formatTime = (time) => {
    return `${time.toString().padStart(2, '0')}:00`
  }

  const getProgressStats = () => {
    const total = tasks.length
    const completed = tasks.filter(task => task.status === 'completed').length
    const inProgress = tasks.filter(task => task.status === 'in_progress').length
    const pending = tasks.filter(task => task.status === 'scheduled').length
    
    return { total, completed, inProgress, pending }
  }

  const stats = getProgressStats()

  if (loading) {
    return (
      <div className="flex-center h-100">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="text-center mb-2">
        <h1><i className="fas fa-calendar-day"></i> Today's Tasks</h1>
        <p className="text-muted">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Progress Stats */}
      <div className="grid-4 mb-2">
        <div className="card text-center">
          <div style={{ fontSize: '2rem', color: '#3498db' }}>{stats.total}</div>
          <div className="text-muted">Total Tasks</div>
        </div>
        <div className="card text-center">
          <div style={{ fontSize: '2rem', color: '#27ae60' }}>{stats.completed}</div>
          <div className="text-muted">Completed</div>
        </div>
        <div className="card text-center">
          <div style={{ fontSize: '2rem', color: '#f39c12' }}>{stats.inProgress}</div>
          <div className="text-muted">In Progress</div>
        </div>
        <div className="card text-center">
          <div style={{ fontSize: '2rem', color: '#e74c3c' }}>{stats.pending}</div>
          <div className="text-muted">Pending</div>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="card text-center">
          <div style={{ padding: '3rem' }}>
            <i className="fas fa-tasks" style={{ fontSize: '3rem', color: '#bdc3c7', marginBottom: '1rem' }}></i>
            <h3>No tasks for today!</h3>
            <p className="text-muted">
              {stats.total === 0 
                ? "Head over to the Planner to create some tasks for today."
                : "Great job! You've completed all your tasks for today."
              }
            </p>
            <a href="/planner" className="btn btn-primary">
              <i className="fas fa-calendar-week"></i> Go to Planner
            </a>
          </div>
        </div>
      ) : (
        <div className="grid-2">
          {/* Pending Tasks */}
          <div>
            <h3 className="mb-1">
              <i className="fas fa-clock"></i> Pending Tasks
              <span className="text-muted"> ({stats.pending})</span>
            </h3>
            {tasks
              .filter(task => task.status === 'scheduled')
              .sort((a, b) => a.startTime - b.startTime)
              .map(task => (
                <TodayTaskCard
                  key={task._id}
                  task={task}
                  onComplete={handleCompleteTask}
                  onReschedule={handleReschedule}
                  getPriorityColor={getPriorityColor}
                  getCategoryColor={getCategoryColor}
                  formatTime={formatTime}
                />
              ))}
          </div>

          {/* Completed Tasks */}
          <div>
            <h3 className="mb-1">
              <i className="fas fa-check-circle"></i> Completed Tasks
              <span className="text-muted"> ({stats.completed})</span>
            </h3>
            {tasks
              .filter(task => task.status === 'completed')
              .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
              .map(task => (
                <TodayTaskCard
                  key={task._id}
                  task={task}
                  onComplete={handleCompleteTask}
                  onReschedule={handleReschedule}
                  getPriorityColor={getPriorityColor}
                  getCategoryColor={getCategoryColor}
                  formatTime={formatTime}
                />
              ))}
          </div>
        </div>
      )}

      {showReschedule && (
        <RescheduleModal
          task={showReschedule}
          onClose={() => setShowReschedule(null)}
          onSubmit={handleRescheduleSubmit}
        />
      )}
    </div>
  )
}

const TodayTaskCard = ({ 
  task, 
  onComplete, 
  onReschedule, 
  getPriorityColor, 
  getCategoryColor, 
  formatTime 
}) => {
  const isCompleted = task.status === 'completed'
  
  return (
    <div className={`today-task ${isCompleted ? 'completed' : ''}`}>
      <div style={{ flex: 1 }}>
        <div className="flex-between mb-1">
          <h4 className="task-title">{task.title}</h4>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span 
              className="text-small"
              style={{ 
                background: getPriorityColor(task.priority), 
                color: 'white', 
                padding: '0.25rem 0.5rem', 
                borderRadius: '4px',
                fontSize: '0.7rem'
              }}
            >
              {task.priority}
            </span>
            <span 
              className="text-small"
              style={{ 
                background: getCategoryColor(task.goal?.category), 
                color: 'white', 
                padding: '0.25rem 0.5rem', 
                borderRadius: '4px',
                fontSize: '0.7rem'
              }}
            >
              {task.goal?.category || 'personal'}
            </span>
          </div>
        </div>
        
        {task.description && (
          <p className="text-muted mb-1">{task.description}</p>
        )}
        
        <div className="text-muted">
          <i className="fas fa-clock"></i> {formatTime(task.startTime)} - {formatTime(task.endTime)}
          {task.duration && ` • ${task.duration} min`}
          {isCompleted && task.completedAt && (
            <span className="text-success">
              {' • '}Completed {new Date(task.completedAt).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
      
      <div className="task-actions">
        {!isCompleted && (
          <>
            <button 
              className="btn btn-success btn-small"
              onClick={() => onComplete(task._id)}
            >
              <i className="fas fa-check"></i>
            </button>
            <button 
              className="btn btn-secondary btn-small"
              onClick={() => onReschedule(task)}
            >
              <i className="fas fa-clock"></i>
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default TodayPage
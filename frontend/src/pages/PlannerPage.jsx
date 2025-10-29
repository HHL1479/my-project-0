import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { goalService, taskService, planningService } from '../service/api'
import GoalForm from '../component/GoalForm'
import WeekGrid from '../component/WeekGrid'

const PlannerPage = () => {
  const [goals, setGoals] = useState([])
  const [selectedGoals, setSelectedGoals] = useState([])
  const [tasks, setTasks] = useState([])
  const [draftTasks, setDraftTasks] = useState([])
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [planning, setPlanning] = useState(false)

  useEffect(() => {
    loadGoals()
    loadTasks()
  }, [])

  const loadGoals = async () => {
    try {
      const response = await goalService.getActiveGoals()
      setGoals(response.data)
    } catch (error) {
      toast.error('Failed to load goals')
    }
  }

  const loadTasks = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const response = await taskService.getTasks({ 
        startDate: today,
        status: 'scheduled'
      })
      setTasks(response.data.tasks)
    } catch (error) {
      toast.error('Failed to load tasks')
    }
  }

  const handleGoalSelect = (goalId) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    )
  }

  const handleCreateGoal = async (goalData) => {
    try {
      await goalService.createGoal(goalData)
      toast.success('Goal created successfully!')
      setShowGoalForm(false)
      loadGoals()
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create goal'
      toast.error(message)
    }
  }

  const handleGeneratePlan = async () => {
    if (selectedGoals.length === 0) {
      toast.error('Please select at least one goal to plan')
      return
    }

    setPlanning(true)
    try {
      const weekStart = new Date().toISOString().split('T')[0]
      const response = await planningService.generatePlan(selectedGoals, weekStart)
      setDraftTasks(response.data.tasks)
      toast.success(`${response.data.tasksGenerated} tasks generated successfully!`)
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to generate plan'
      toast.error(message)
    } finally {
      setPlanning(false)
    }
  }

  const handleCommitPlan = async () => {
    if (draftTasks.length === 0) {
      toast.error('No tasks to commit')
      return
    }

    setLoading(true)
    try {
      const taskIds = draftTasks.map(task => task._id)
      await planningService.commitPlan(taskIds)
      toast.success('Plan committed successfully!')
      setDraftTasks([])
      loadTasks()
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to commit plan'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDrafts = async () => {
    try {
      await planningService.deleteDrafts()
      setDraftTasks([])
      toast.info('Draft tasks deleted')
    } catch (error) {
      toast.error('Failed to delete drafts')
    }
  }

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      await taskService.updateTask(taskId, updates)
      toast.success('Task updated successfully!')
      
      // Update local state
      setDraftTasks(prev => prev.map(task => 
        task._id === taskId ? { ...task, ...updates } : task
      ))
    } catch (error) {
      toast.error('Failed to update task')
    }
  }

  const handleTaskDelete = async (taskId) => {
    try {
      await taskService.deleteTask(taskId)
      toast.success('Task deleted successfully!')
      setDraftTasks(prev => prev.filter(task => task._id !== taskId))
    } catch (error) {
      toast.error('Failed to delete task')
    }
  }

  return (
    <div className="layout">
      <div className="sidebar">
        <div className="flex-between mb-2">
          <h3><i className="fas fa-bullseye"></i> Goals</h3>
          <button 
            className="btn btn-primary btn-small"
            onClick={() => setShowGoalForm(true)}
          >
            <i className="fas fa-plus"></i> Add Goal
          </button>
        </div>

        <div className="mb-2">
          <h4>Select Goals to Plan:</h4>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {goals.map(goal => (
              <div 
                key={goal._id}
                className={`goal-card ${goal.category} ${selectedGoals.includes(goal._id) ? 'selected' : ''}`}
                onClick={() => handleGoalSelect(goal._id)}
              >
                <div className="flex-between">
                  <div>
                    <strong>{goal.title}</strong>
                    <div className="text-muted">
                      Effort: {goal.effort}/5 • {goal.category}
                    </div>
                    {goal.targetDate && (
                      <div className="text-muted">
                        Target: {new Date(goal.targetDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <div>
                    {selectedGoals.includes(goal._id) && (
                      <i className="fas fa-check-circle text-success"></i>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2">
          <button 
            className="btn btn-success w-100 mb-1"
            onClick={handleGeneratePlan}
            disabled={planning || selectedGoals.length === 0}
          >
            {planning ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Planning...
              </>
            ) : (
              <>
                <i className="fas fa-magic"></i> Plan Selected Goals
              </>
            )}
          </button>

          {draftTasks.length > 0 && (
            <>
              <button 
                className="btn btn-primary w-100 mb-1"
                onClick={handleCommitPlan}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Committing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check"></i> Commit Plan
                  </>
                )}
              </button>
              <button 
                className="btn btn-secondary w-100"
                onClick={handleDeleteDrafts}
              >
                <i className="fas fa-trash"></i> Delete Drafts
              </button>
            </>
          )}
        </div>
      </div>

      <div className="content-area">
        <div className="flex-between mb-2">
          <h2><i className="fas fa-calendar-week"></i> Weekly Planner</h2>
          <div className="text-muted">
            {draftTasks.length > 0 && `${draftTasks.length} draft tasks`}
          </div>
        </div>

        <WeekGrid 
          tasks={[...tasks, ...draftTasks]}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
          showDrafts={true}
        />
      </div>

      {showGoalForm && (
        <GoalForm
          onClose={() => setShowGoalForm(false)}
          onSubmit={handleCreateGoal}
        />
      )}
    </div>
  )
}

export default PlannerPage
import { useState, useEffect } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { toast } from 'react-toastify'
import { taskService } from '../service/api'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const HOURS = Array.from({ length: 24 }, (_, i) => i)

const TaskBlock = ({ task, onUpdate, onDelete }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { task },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }))

  const handleDelete = (e) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task._id)
    }
  }

  return (
    <div
      ref={drag}
      className={`task-block ${task.status === 'draft' ? 'draft' : ''} ${task.goal?.category || 'personal'}`}
      style={{
        height: `${(task.endTime - task.startTime) * 40}px`,
        opacity: isDragging ? 0.5 : 1,
        cursor: task.status === 'draft' ? 'move' : 'default'
      }}
      title={`${task.title} (${task.startTime}:00 - ${task.endTime}:00)`}
    >
      <div className="flex-between">
        <span className="task-title">{task.title}</span>
        {task.status === 'draft' && (
          <button 
            className="btn btn-danger btn-small" 
            onClick={handleDelete}
            style={{ padding: '0.25rem' }}
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
      {task.description && (
        <div style={{ fontSize: '0.6rem', marginTop: '0.25rem' }}>
          {task.description}
        </div>
      )}
    </div>
  )
}

const GridCell = ({ day, hour, onDrop, children }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item) => onDrop(item.task, day, hour),
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }))

  return (
    <div
      ref={drop}
      className="grid-cell"
      style={{
        background: isOver ? '#e3f2fd' : 'white',
        minHeight: '40px',
        position: 'relative'
      }}
    >
      {children}
    </div>
  )
}

const WeekGrid = ({ tasks, onTaskUpdate, onTaskDelete, showDrafts = false }) => {
  const [backboneBlocks, setBackboneBlocks] = useState([])

  useEffect(() => {
    loadBackbone()
  }, [])

  const loadBackbone = async () => {
    try {
      // This would need to be implemented to load backbone blocks
      // For now, we'll use mock data
      const mockBackbone = [
        { day: 1, startTime: 9, endTime: 17, label: 'Work', color: '#bdc3c7', type: 'work' },
        { day: 1, startTime: 23, endTime: 24, label: 'Sleep', color: '#34495e', type: 'sleep' },
        { day: 2, startTime: 9, endTime: 17, label: 'Work', color: '#bdc3c7', type: 'work' },
        { day: 2, startTime: 23, endTime: 24, label: 'Sleep', color: '#34495e', type: 'sleep' }
      ]
      setBackboneBlocks(mockBackbone)
    } catch (error) {
      console.error('Failed to load backbone')
    }
  }

  const getTasksForCell = (day, hour) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.scheduledDate)
      const taskDay = (taskDate.getDay() + 6) % 7 // Convert Sunday=0 to Monday=0
      return taskDay === day && hour >= task.startTime && hour < task.endTime
    })
  }

  const getBackboneBlocksForCell = (day, hour) => {
    return backboneBlocks.filter(block => 
      block.day === day && hour >= block.startTime && hour < block.endTime
    )
  }

  const handleTaskDrop = async (task, newDay, newHour) => {
    if (task.status !== 'draft') {
      toast.error('Only draft tasks can be moved')
      return
    }

    try {
      // Calculate new date based on day offset
      const today = new Date()
      const daysToAdd = newDay - ((today.getDay() + 6) % 7)
      const newDate = new Date(today)
      newDate.setDate(today.getDate() + daysToAdd)

      const duration = task.endTime - task.startTime
      
      await onTaskUpdate(task._id, {
        scheduledDate: newDate.toISOString().split('T')[0],
        startTime: newHour,
        endTime: newHour + duration
      })

      toast.success('Task moved successfully!')
    } catch (error) {
      toast.error('Failed to move task')
    }
  }

  return (
    <div className="week-grid" style={{ height: '600px' }}>
      {/* Time column */}
      <div></div>
      {HOURS.map(hour => (
        <div key={`time-${hour}`} className="time-slot">
          {hour.toString().padStart(2, '0')}:00
        </div>
      ))}

      {/* Day columns */}
      {DAYS.map((day, dayIndex) => (
        <div key={day} style={{ display: 'contents' }}>
          <div className="day-header">{day}</div>
          {HOURS.map(hour => {
            const cellTasks = getTasksForCell(dayIndex, hour)
            const cellBackbone = getBackboneBlocksForCell(dayIndex, hour)
            
            return (
              <GridCell
                key={`${day}-${hour}`}
                day={dayIndex}
                hour={hour}
                onDrop={handleTaskDrop}
              >
                {/* Backbone blocks */}
                {cellBackbone.map((block, index) => (
                  <div
                    key={`backbone-${index}`}
                    className="backbone-block"
                    style={{
                      background: block.color,
                      height: `${(block.endTime - block.startTime) * 40}px`,
                      zIndex: 1
                    }}
                    title={`${block.label} (${block.startTime}:00 - ${block.endTime}:00)`}
                  >
                    <span>{block.label}</span>
                  </div>
                ))}
                
                {/* Tasks */}
                {cellTasks.map(task => (
                  <TaskBlock
                    key={task._id}
                    task={task}
                    onUpdate={onTaskUpdate}
                    onDelete={onTaskDelete}
                  />
                ))}
              </GridCell>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default WeekGrid
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { backboneService } from '../service/api'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const HOURS = Array.from({ length: 24 }, (_, i) => i)

const BLOCK_TYPES = [
  { id: 'work', label: 'Work', color: '#bdc3c7', icon: 'fas fa-briefcase' },
  { id: 'sleep', label: 'Sleep', color: '#34495e', icon: 'fas fa-bed' },
  { id: 'meal', label: 'Meal', color: '#e67e22', icon: 'fas fa-utensils' },
  { id: 'commute', label: 'Commute', color: '#9b59b6', icon: 'fas fa-car' },
  { id: 'personal', label: 'Personal', color: '#1abc9c', icon: 'fas fa-user' },
  { id: 'other', label: 'Other', color: '#95a5a6', icon: 'fas fa-ellipsis-h' }
]

const BackboneBuilder = () => {
  const [schedule, setSchedule] = useState([])
  const [selectedType, setSelectedType] = useState('work')
  const [selectedColor, setSelectedColor] = useState('#bdc3c7')
  const [blockLabel, setBlockLabel] = useState('')
  const [startTime, setStartTime] = useState(9)
  const [endTime, setEndTime] = useState(17)
  const [selectedDay, setSelectedDay] = useState(1)
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()

  useEffect(() => {
    loadExistingBackbone()
  }, [])

  const loadExistingBackbone = async () => {
    try {
      const response = await backboneService.getBackbone()
      if (response.data.schedule) {
        setSchedule(response.data.schedule)
      }
    } catch (error) {
      // No existing backbone, start fresh
    }
  }

  const handleAddBlock = () => {
    if (!blockLabel.trim()) {
      toast.error('Please enter a label for the time block')
      return
    }

    if (startTime >= endTime) {
      toast.error('End time must be after start time')
      return
    }

    const newBlock = {
      day: selectedDay,
      startTime,
      endTime,
      label: blockLabel,
      color: selectedColor,
      type: selectedType
    }

    // Remove any overlapping blocks
    const filteredSchedule = schedule.filter(block => 
      !(block.day === selectedDay && 
        ((block.startTime <= startTime && block.endTime > startTime) ||
         (block.startTime < endTime && block.endTime >= endTime) ||
         (startTime <= block.startTime && endTime >= block.endTime)))
    )

    setSchedule([...filteredSchedule, newBlock])
    toast.success('Time block added successfully!')
    
    // Clear form
    setBlockLabel('')
  }

  const handleRemoveBlock = (index) => {
    const newSchedule = schedule.filter((_, i) => i !== index)
    setSchedule(newSchedule)
    toast.info('Time block removed')
  }

  const handleSaveBackbone = async () => {
    if (schedule.length === 0) {
      toast.error('Please add at least one time block to your schedule')
      return
    }

    setLoading(true)
    try {
      await backboneService.saveBackbone(schedule)
      toast.success('Backbone schedule saved successfully!')
      navigate('/planner')
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to save backbone'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const getBlocksForDayAndHour = (day, hour) => {
    return schedule.filter(block => 
      block.day === day && hour >= block.startTime && hour < block.endTime
    )
  }

  const getBlockHeight = (block) => {
    return (block.endTime - block.startTime) * 40 // 40px per hour
  }

  const getBlockPosition = (block) => {
    return (block.startTime % 1) * 40 // Handle partial hours
  }

  return (
    <div className="container">
      <div className="text-center mb-2">
        <h1><i className="fas fa-clock"></i> Backbone Builder</h1>
        <p className="text-muted">
          Define your fixed schedule blocks (work, sleep, meals, etc.) to create your personal time backbone
        </p>
      </div>

      <div className="backbone-builder">
        <div className="builder-grid">
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
                  const blocks = getBlocksForDayAndHour(dayIndex, hour)
                  return (
                    <div key={`${day}-${hour}`} className="grid-cell">
                      {blocks.map((block, index) => (
                        <div
                          key={index}
                          className="backbone-block"
                          style={{
                            background: block.color,
                            height: `${getBlockHeight(block)}px`,
                            top: `${getBlockPosition(block)}px`
                          }}
                          title={`${block.label} (${block.startTime}:00 - ${block.endTime}:00)`}
                        >
                          <span>{block.label}</span>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="builder-controls">
          <h3><i className="fas fa-plus-circle"></i> Add Time Block</h3>
          
          <div className="form-group">
            <label>Block Type</label>
            <div className="block-type-selector">
              {BLOCK_TYPES.map(type => (
                <button
                  key={type.id}
                  type="button"
                  className={`block-type-btn ${selectedType === type.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedType(type.id)
                    setSelectedColor(type.color)
                    if (!blockLabel) setBlockLabel(type.label)
                  }}
                >
                  <i className={type.icon}></i> {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="label">Label</label>
            <input
              type="text"
              id="label"
              value={blockLabel}
              onChange={(e) => setBlockLabel(e.target.value)}
              placeholder="Enter block label"
            />
          </div>

          <div className="time-inputs">
            <div className="form-group">
              <label htmlFor="startTime">Start Time</label>
              <select
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(Number(e.target.value))}
              >
                {HOURS.map(hour => (
                  <option key={hour} value={hour}>
                    {hour.toString().padStart(2, '0')}:00
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="endTime">End Time</label>
              <select
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(Number(e.target.value))}
              >
                {HOURS.map(hour => (
                  <option key={hour} value={hour}>
                    {hour.toString().padStart(2, '0')}:00
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Day</label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(Number(e.target.value))}
            >
              {DAYS.map((day, index) => (
                <option key={day} value={index}>{day}</option>
              ))}
            </select>
          </div>

          <button type="button" className="btn btn-primary w-100 mb-2" onClick={handleAddBlock}>
            <i className="fas fa-plus"></i> Add Block
          </button>

          <div className="mt-2">
            <h4>Current Schedule ({schedule.length} blocks)</h4>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {schedule.map((block, index) => (
                <div key={index} className="card mb-1" style={{ padding: '0.5rem' }}>
                  <div className="flex-between">
                    <div>
                      <strong>{block.label}</strong>
                      <div className="text-muted">
                        {DAYS[block.day]} {block.startTime}:00 - {block.endTime}:00
                      </div>
                    </div>
                    <button
                      className="btn btn-danger btn-small"
                      onClick={() => handleRemoveBlock(index)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            className="btn btn-success w-100 mt-2" 
            onClick={handleSaveBackbone}
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i> Save & Continue
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BackboneBuilder
import { useState } from 'react'

const RescheduleModal = ({ task, onClose, onSubmit }) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date(task.scheduledDate).toISOString().split('T')[0]
  )
  const [selectedTime, setSelectedTime] = useState(task.startTime)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(selectedDate, selectedTime)
  }

  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 6; hour < 24; hour++) {
      slots.push(hour)
    }
    return slots
  }

  return (
    <div className="modal">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h3>Reschedule Task</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="taskTitle">Task</label>
            <input
              type="text"
              id="taskTitle"
              value={task.title}
              disabled
              style={{ background: '#f8f9fa' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">New Date</label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">New Time</label>
            <select
              id="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(Number(e.target.value))}
            >
              {generateTimeSlots().map(hour => (
                <option key={hour} value={hour}>
                  {hour.toString().padStart(2, '0')}:00
                </option>
              ))}
            </select>
            <div className="text-muted mt-1">
              Duration: {task.duration} minutes
            </div>
          </div>

          <div className="flex-between mt-2">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <i className="fas fa-save"></i> Reschedule Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RescheduleModal
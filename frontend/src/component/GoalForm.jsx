import { useState } from 'react'

const GoalForm = ({ onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || 'other',
    effort: initialData?.effort || 3,
    targetDate: initialData?.targetDate || ''
  })

  const categories = [
    { id: 'health', label: 'Health', icon: 'fas fa-heart' },
    { id: 'learning', label: 'Learning', icon: 'fas fa-book' },
    { id: 'career', label: 'Career', icon: 'fas fa-briefcase' },
    { id: 'social', label: 'Social', icon: 'fas fa-users' },
    { id: 'finance', label: 'Finance', icon: 'fas fa-dollar-sign' },
    { id: 'hobby', label: 'Hobby', icon: 'fas fa-gamepad' },
    { id: 'personal', label: 'Personal', icon: 'fas fa-user' },
    { id: 'other', label: 'Other', icon: 'fas fa-ellipsis-h' }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'effort' ? Number(value) : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      alert('Please enter a goal title')
      return
    }
    onSubmit(formData)
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{initialData ? 'Edit Goal' : 'Create New Goal'}</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Goal Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Learn React Development"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe your goal in more detail..."
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              {categories.map(category => (
                <button
                  key={category.id}
                  type="button"
                  className={`block-type-btn ${formData.category === category.id ? 'selected' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, category: category.id }))}
                  style={{ padding: '0.75rem', fontSize: '0.9rem' }}
                >
                  <i className={category.icon}></i> {category.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="effort">Effort Level (1-5)</label>
            <input
              type="range"
              id="effort"
              name="effort"
              min="1"
              max="5"
              value={formData.effort}
              onChange={handleChange}
              className="effort-slider"
            />
            <div className="effort-labels">
              <span>Minimal (5-15 min/day)</span>
              <span>Light (15-30 min/day)</span>
              <span>Moderate (30-60 min/day)</span>
              <span>Significant (1-2 hrs/day)</span>
              <span>Intensive (2+ hrs/day)</span>
            </div>
            <div className="text-center mt-1">
              <strong>Current: {formData.effort}/5</strong>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="targetDate">Target Date (Optional)</label>
            <input
              type="date"
              id="targetDate"
              name="targetDate"
              value={formData.targetDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="flex-between mt-2">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <i className="fas fa-save"></i> {initialData ? 'Update Goal' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GoalForm
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { userService } from '../service/api'
import { useAuth } from '../content/AuthContext'

const SettingsPage = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    preferences: {
      defaultTaskLength: 60,
      timezone: 'UTC',
      preferredTimeWindows: []
    }
  })
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
  const loadData = async () => {
    setLoading(true); // 开始加载
    try {
      // 使用 Promise.all 并行获取 profile 和 stats
      await Promise.all([
        loadProfile(),
        loadStats()
      ]);
    } catch (error) {
      // 主要错误已在各自函数中处理并 toast 了
      console.error("SettingsPage: Error loading initial data.", error);
    } finally {
      setLoading(false); // 确保在两个请求都尝试过后设置 loading 为 false
    }
  };

  loadData();
}, []); // 保持空依赖数组，只加载一次

  const loadProfile = async () => {
    try {
      const response = await userService.getProfile()
      setProfile(response.data.user)
    } catch (error) {
      toast.error('Failed to load profile')
    }
  }

  const loadStats = async () => {
  try {
    const response = await userService.getStats();
    setStats(response.data);
  } catch (error) {
    console.error('Failed to load stats', error);
  }
  // 不需要 finally 块了
};

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePreferenceChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: name === 'defaultTaskLength' ? Number(value) : value
      }
    }))
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      await userService.updateProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
        preferences: profile.preferences
      })
      toast.success('Profile updated successfully!')
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  const handleCompleteOnboarding = async () => {
    try {
      await userService.completeOnboarding()
      toast.success('Onboarding completed!')
      // Refresh user data
      loadProfile()
    } catch (error) {
      toast.error('Failed to complete onboarding')
    }
  }

  const timezones = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney'
  ]

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
        <h1><i className="fas fa-cog"></i> Settings</h1>
        <p className="text-muted">Manage your profile and preferences</p>
      </div>

      <div className="grid-2">
        {/* Profile Settings */}
        <div className="card">
          <h3><i className="fas fa-user"></i> Profile Settings</h3>
          
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={profile.firstName}
              onChange={handleProfileChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={profile.lastName}
              onChange={handleProfileChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              disabled
              style={{ background: '#f8f9fa' }}
            />
            <small className="text-muted">Email cannot be changed</small>
          </div>

          <button 
            className="btn btn-primary w-100"
            onClick={handleSaveProfile}
            disabled={saving}
          >
            {saving ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i> Save Profile
              </>
            )}
          </button>

          {user?.isFirstTimeUser && (
            <button 
              className="btn btn-success w-100 mt-1"
              onClick={handleCompleteOnboarding}
            >
              <i className="fas fa-check-circle"></i> Complete Onboarding
            </button>
          )}
        </div>

        {/* Preferences */}
        <div className="card">
          <h3><i className="fas fa-sliders-h"></i> Preferences</h3>
          
          <div className="form-group">
            <label htmlFor="defaultTaskLength">Default Task Length (minutes)</label>
            <input
              type="number"
              id="defaultTaskLength"
              name="defaultTaskLength"
              min="15"
              max="480"
              step="15"
              value={profile.preferences.defaultTaskLength}
              onChange={handlePreferenceChange}
            />
            <small className="text-muted">
              Default duration for new tasks (15-480 minutes)
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="timezone">Timezone</label>
            <select
              id="timezone"
              name="timezone"
              value={profile.preferences.timezone}
              onChange={handlePreferenceChange}
            >
              {timezones.map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Preferred Time Windows</label>
            <div className="text-muted mb-1">
              <small>
                Define your preferred times for task scheduling.
                <br />
                This feature is coming soon!
              </small>
            </div>
            <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
              <p className="text-center text-muted">
                <i className="fas fa-clock"></i>
                <br />
                Time window preferences will be available in a future update
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="card">
            <h3><i className="fas fa-chart-bar"></i> Your Statistics</h3>
            
            <div className="grid-2">
              <div className="text-center">
                <div style={{ fontSize: '2rem', color: '#3498db' }}>
                  {stats.totalTasks || 0}
                </div>
                <div className="text-muted">Total Tasks</div>
              </div>
              
              <div className="text-center">
                <div style={{ fontSize: '2rem', color: '#27ae60' }}>
                  {stats.totalGoals || 0}
                </div>
                <div className="text-muted">Total Goals</div>
              </div>
            </div>

            <div className="mt-2">
              <h4>Task Status</h4>
              <div className="grid-3">
                <div className="text-center">
                  <div style={{ color: '#f39c12' }}>
                    {stats.taskStats?.scheduled || 0}
                  </div>
                  <div className="text-muted">Scheduled</div>
                </div>
                <div className="text-center">
                  <div style={{ color: '#27ae60' }}>
                    {stats.taskStats?.completed || 0}
                  </div>
                  <div className="text-muted">Completed</div>
                </div>
                <div className="text-center">
                  <div style={{ color: '#e74c3c' }}>
                    {stats.taskStats?.cancelled || 0}
                  </div>
                  <div className="text-muted">Cancelled</div>
                </div>
              </div>
            </div>

            <div className="mt-2">
              <h4>Goal Status</h4>
              <div className="grid-3">
                <div className="text-center">
                  <div style={{ color: '#3498db' }}>
                    {stats.goalStats?.active || 0}
                  </div>
                  <div className="text-muted">Active</div>
                </div>
                <div className="text-center">
                  <div style={{ color: '#27ae60' }}>
                    {stats.goalStats?.completed || 0}
                  </div>
                  <div className="text-muted">Completed</div>
                </div>
                <div className="text-center">
                  <div style={{ color: '#95a5a6' }}>
                    {stats.goalStats?.paused || 0}
                  </div>
                  <div className="text-muted">Paused</div>
                </div>
              </div>
            </div>

            {stats.weeklyCompleted > 0 && (
              <div className="mt-2 text-center">
                <div style={{ fontSize: '1.5rem', color: '#27ae60' }}>
                  {stats.weeklyCompleted}
                </div>
                <div className="text-muted">Tasks completed this week</div>
              </div>
            )}
          </div>
        )}

        {/* Account Actions */}
        <div className="card">
          <h3><i className="fas fa-user-shield"></i> Account</h3>
          
          <div className="text-muted mb-2">
            <small>
              Account management features like password change, 
              account deletion, and data export are coming soon!
            </small>
          </div>

          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <div className="grid-2 gap-1">
              <button className="btn btn-secondary" disabled>
                <i className="fas fa-key"></i> Change Password
              </button>
              <button className="btn btn-secondary" disabled>
                <i className="fas fa-download"></i> Export Data
              </button>
              <button className="btn btn-danger" disabled>
                <i className="fas fa-trash"></i> Delete Account
              </button>
              <button className="btn btn-info" disabled>
                <i className="fas fa-bell"></i> Notifications
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
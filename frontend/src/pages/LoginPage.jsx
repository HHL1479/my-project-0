import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../content/AuthContext'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await login(formData.email, formData.password)
      toast.success('Login successful!')
      
      // Redirect based on whether user is first time
      if (response.user.isFirstTimeUser) {
        navigate('/backbone')
      } else {
        navigate('/planner')
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-center h-100">
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="text-center mb-2">
          <i className="fas fa-robot" style={{ fontSize: '3rem', color: '#3498db' }}></i>
          <h1 style={{ margin: '1rem 0', color: '#2c3e50' }}>AI Life Coach</h1>
          <p className="text-muted">Smart Personal Goal Planner</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Logging in...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i> Login
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-2">
          <p className="text-muted">
            Don't have an account? <Link to="/register" className="text-primary">Register here</Link>
          </p>
        </div>

        {/* Demo credentials for testing */}
        <div className="text-center mt-2" style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
          <p>Demo: demo@example.com / demo123</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
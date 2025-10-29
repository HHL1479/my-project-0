import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './content/AuthContext'

import Layout from './component/Layout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BackboneBuilder from './pages/BackboneBuilder'
import PlannerPage from './pages/PlannerPage'
import TodayPage from './pages/TodayPage'
import SettingsPage from './pages/SettingsPage'

import './App.css'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>
  }

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/planner" />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/planner" />} />
        
        {/* Protected Routes */}
        <Route path="/" element={user ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Navigate to="/planner" />} />
          <Route path="backbone" element={<BackboneBuilder />} />
          <Route path="planner" element={<PlannerPage />} />
          <Route path="today" element={<TodayPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App
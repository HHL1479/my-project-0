import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../content/AuthContext'

const Layout = () => {
  const { user, logout } = useAuth()

  return (
    <div className="App">
      <nav className="navbar">
        <NavLink to="/" className="navbar-brand">
          <i className="fas fa-robot"></i> AI Life Coach
        </NavLink>
        
        <ul className="navbar-nav">
          <li>
            <NavLink to="/planner" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="fas fa-calendar-week"></i> Planner
            </NavLink>
          </li>
          <li>
            <NavLink to="/today" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="fas fa-tasks"></i> Today
            </NavLink>
          </li>
          <li>
            <NavLink to="/backbone" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="fas fa-clock"></i> Backbone
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="fas fa-cog"></i> Settings
            </NavLink>
          </li>
          <li>
            <button onClick={logout} className="btn btn-danger btn-small">
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </li>
        </ul>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
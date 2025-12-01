import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

export function Dashboard() {
  const { user, signOut } = useAuth();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🔬 Field Research App</h1>
          <div className="user-menu">
            <span>{user?.email}</span>
            <button onClick={signOut} className="btn-logout">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-section">
          <h2>Welcome to Field Research!</h2>
          <p>Your specimen collection and data management platform.</p>
          
          <div className="quick-stats">
            <div className="stat-card">
              <h3>0</h3>
              <p>Projects</p>
            </div>
            <div className="stat-card">
              <h3>0</h3>
              <p>Specimens</p>
            </div>
            <div className="stat-card">
              <h3>Ready</h3>
              <p>Status</p>
            </div>
          </div>

          <div className="coming-soon">
            <h3>🚀 Coming Soon</h3>
            <ul>
              <li>✅ Project Management</li>
              <li>✅ Enhanced Specimen Collection</li>
              <li>✅ Species API Integration</li>
              <li>✅ Voice-to-Text Entry</li>
              <li>✅ Photo Uploads</li>
              <li>✅ Real-time Collaboration</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

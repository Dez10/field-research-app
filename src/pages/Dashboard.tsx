import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ProjectList } from '../features/projects/ProjectList';
import './Dashboard.css';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

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
        <ProjectList 
          onProjectSelect={setSelectedProjectId}
          selectedProjectId={selectedProjectId}
        />
        
        {selectedProjectId && (
          <div className="project-details">
            <p>Project selected: {selectedProjectId}</p>
            <p>Specimen collection coming next...</p>
          </div>
        )}
      </main>
    </div>
  );
}

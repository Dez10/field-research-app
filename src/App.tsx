import { useState } from 'react';
import { SpecimenForm } from './features/specimens/SpecimenForm';
import { SpecimenList } from './features/specimens/SpecimenList';
import './App.css';

function App() {
  const [activeView, setActiveView] = useState<'collect' | 'list'>('collect');

  return (
    <div className="app">
      <header className="app-header">
        <h1> Field Research App</h1>
        <p className="tagline">Specimen Collection & Data Management</p>
      </header>

      <nav className="app-nav">
        <button 
          className={activeView === 'collect' ? 'active' : ''}
          onClick={() => setActiveView('collect')}
        >
           Collect Specimen
        </button>
        <button 
          className={activeView === 'list' ? 'active' : ''}
          onClick={() => setActiveView('list')}
        >
           View Collection
        </button>
      </nav>

      <main className="app-main">
        {activeView === 'collect' && <SpecimenForm />}
        {activeView === 'list' && <SpecimenList />}
      </main>

      <footer className="app-footer">
        <div className="status-bar">
          <span className="status-online"> Offline Mode Active</span>
          <span>Data stored locally</span>
        </div>
      </footer>
    </div>
  );
}

export default App;

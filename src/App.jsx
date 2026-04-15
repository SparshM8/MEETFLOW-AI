import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { AppProvider, AppContext } from './context/AppContext';
import Navigation from './components/Navigation';
import RerouteAlert from './components/RerouteAlert';
import SessionDrawer from './components/SessionDrawer';
import ConnectionModal from './components/ConnectionModal';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Agenda from './pages/Agenda';
import MatchDetails from './pages/MatchDetails';
import Profile from './pages/Profile';
import Explore from './pages/Explore';
import AIChatFAB from './components/AIChatFAB';

import './App.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error('MeetFlow Error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ color: 'var(--text-primary)' }}>Something went wrong. Please refresh the page.</h2>
          <button onClick={() => window.location.reload()} style={{ padding: '0.75rem 1.5rem', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            Refresh
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const MainLayout = ({ children }) => {
  const { currentUser, activeDrawerSession, setActiveDrawerSession, activeConnectionMatch, setActiveConnectionMatch, setIsSidebarOpen } = useContext(AppContext);

  return (
    <div className="app-container">
      {currentUser && <Navigation />}

      <main className={`main-content ${currentUser ? 'with-nav' : ''}`}>
        {currentUser && (
          <div className="mobile-header flex-between">
            <h2 className="brand-text gradient-text" style={{ fontSize: '1.25rem' }}>MeetFlow AI</h2>
            <button className="btn-icon" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        )}
        <div className="content-pad">
          {children}
        </div>
      </main>

      <RerouteAlert />
      {activeDrawerSession && (
        <SessionDrawer
          sessionId={activeDrawerSession}
          onClose={() => setActiveDrawerSession(null)}
        />
      )}
      {activeConnectionMatch && (
        <ConnectionModal
          match={activeConnectionMatch}
          onClose={() => setActiveConnectionMatch(null)}
        />
      )}
      <AIChatFAB />
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useContext(AppContext);
  if (!currentUser) return <Navigate to="/" replace />;
  return children;
};

const App = () => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Onboarding />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agenda"
                element={
                  <ProtectedRoute>
                    <Agenda />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/match/:id"
                element={
                  <ProtectedRoute>
                    <MatchDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/explore"
                element={
                  <ProtectedRoute>
                    <Explore />
                  </ProtectedRoute>
                }
              />
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </MainLayout>
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;

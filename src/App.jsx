import React, { Suspense, lazy, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Menu, Sparkles } from 'lucide-react';
import { AppProvider, AppContext } from './context/AppContext';
import Navigation from './components/Navigation';
import RerouteAlert from './components/RerouteAlert';
import SessionDrawer from './components/SessionDrawer';
import ConnectionModal from './components/ConnectionModal';
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Agenda = lazy(() => import('./pages/Agenda'));
const MatchDetails = lazy(() => import('./pages/MatchDetails'));
const Profile = lazy(() => import('./pages/Profile'));
const Explore = lazy(() => import('./pages/Explore'));
const LandingPage = lazy(() => import('./pages/LandingPage'));

/**
 * Handle Chunk Load Errors (Google Best Practice)
 * Prevents blank screens when a new version is deployed.
 */
const safeLazy = (importFn) => {
  return lazy(() => 
    importFn().catch((error) => {
      console.error('MatchFlow Chunk Load Error:', error);
      if (error.name === 'ChunkLoadError' || error.message.includes('Loading chunk')) {
        window.location.reload();
      }
      throw error;
    })
  );
};

const LazyDashboard = safeLazy(() => import('./pages/Dashboard'));
const LazyAgenda = safeLazy(() => import('./pages/Agenda'));
const LazyProfile = safeLazy(() => import('./pages/Profile'));
const LazyExplore = safeLazy(() => import('./pages/Explore'));
const LazyMatchDetails = safeLazy(() => import('./pages/MatchDetails'));
const LazyOnboarding = safeLazy(() => import('./pages/Onboarding'));
const LazyLanding = safeLazy(() => import('./pages/LandingPage'));
import NetworkGraph from './components/NetworkGraph';
import ConciergeBot from './components/ConciergeBot';
import TermsPrivacy from './pages/TermsPrivacy';
import AIChatFAB from './components/AIChatFAB';
import { GAPageView } from './services/analytics';

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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '1rem', background: '#06060c', color: 'white' }}>
          <h2 style={{ fontSize: '1.5rem' }}>Unexpected Error Detected</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '400px', textAlign: 'center' }}>MeetFlow AI encountered an issue. Our concierge is working on a fix.</p>
          <button onClick={() => window.location.reload()} style={{ padding: '0.8rem 2rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 14px rgba(99,102,241,0.4)' }}>
            Restart Application
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

      <main id="main-content" className={`main-content ${currentUser ? 'with-nav' : ''}`}>
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

const RouteLoader = () => (
  <div className="dashboard-gate flex-col gap-4" role="status" aria-live="polite">
    <div className="loader-pulse-ring">
      <Sparkles size={32} className="text-accent-primary animate-pulse" />
    </div>
    <div className="text-center">
      <h2 className="text-xl font-bold text-primary">MeetFlow AI</h2>
      <p className="text-secondary text-sm">Fine-tuning your event journey...</p>
    </div>
  </div>
);

const App = () => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <MainLayout>
            <Suspense fallback={<RouteLoader />}>
              <Routes>
                {/* ... routes ... */}
                <Route path="/" element={<LazyLanding />} />
                <Route path="/onboarding" element={<LazyOnboarding />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <LazyDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/agenda"
                  element={
                    <ProtectedRoute>
                      <LazyAgenda />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/match/:id"
                  element={
                    <ProtectedRoute>
                      <LazyMatchDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <LazyProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/explore"
                  element={
                    <ProtectedRoute>
                      <LazyExplore />
                    </ProtectedRoute>
                  }
                />
                <Route path="/privacy" element={<TermsPrivacy />} />
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </MainLayout>
          <ConciergeBot />
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;

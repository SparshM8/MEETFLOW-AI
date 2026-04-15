import React, { createContext, useEffect, useMemo, useRef, useState } from 'react';
import { sessions as initialSessions, attendees } from '../data/mockData';
import { getRecommendedAgenda, getAlternativeSession } from '../utils/agenda';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

/* ── localStorage helpers ───────────────── */
const STORAGE_KEY = 'meetflow_v1';

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors (private browsing, etc.)
  }
};

/* ── Toast Component ────────────────────── */
const TOAST_ICONS = {
  success: <CheckCircle2 size={15} />,
  warning: <AlertTriangle size={15} />,
  info: <Info size={15} />,
};

const Toast = ({ toasts, removeToast }) => (
  <div className="toast-stack">
    {toasts.map(t => (
      <div
        key={t.id}
        className={`global-toast toast-${t.type} animate-slide-down`}
        onClick={() => removeToast(t.id)}
      >
        <span className={`toast-icon toast-icon-${t.type}`}>
          {TOAST_ICONS[t.type]}
        </span>
        <span className="toast-text">{t.message}</span>
        <button className="toast-close"><X size={12} /></button>
      </div>
    ))}
  </div>
);

/* ── Provider ───────────────────────────── */
export const AppProvider = ({ children }) => {
  const saved = loadState();

  const [currentUser, setCurrentUser] = useState(saved.currentUser || null);
  const [sessions, setSessions] = useState(initialSessions);
  const [rerouteOverrides, setRerouteOverrides] = useState({});
  const [userAgenda, setUserAgenda] = useState(saved.userAgenda || []);
  const [waitlist, setWaitlist] = useState(saved.waitlist || []);
  const [rerouteAlert, setRerouteAlert] = useState(null);
  const [networkRoster, setNetworkRoster] = useState(saved.networkRoster || []);
  const [sessionNotes, setSessionNotes] = useState(saved.sessionNotes || {}); // { sessionId: "note text" }

  const [activeDrawerSession, setActiveDrawerSession] = useState(null);
  const [activeConnectionMatch, setActiveConnectionMatch] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Typed toasts: [{ id, message, type }]
  const [toasts, setToasts] = useState([]);
  // Legacy single toast (so components using toastMessage still work)
  const [toastMessage, setToastMessage] = useState('');
  const toastIdRef = useRef(1);
  const recommendedAgenda = useMemo(() => {
    if (!currentUser?.name) return [];
    const baseRecommendations = getRecommendedAgenda(currentUser, sessions);
    return baseRecommendations.map(session =>
      rerouteOverrides[session.id]
        ? { ...rerouteOverrides[session.id], isAlternate: true }
        : session
    );
  }, [currentUser, sessions, rerouteOverrides]);

  /* ── Persistence: save on every relevant state change ── */
  useEffect(() => {
    saveState({ currentUser, userAgenda, waitlist, networkRoster, sessionNotes });
  }, [currentUser, userAgenda, waitlist, networkRoster, sessionNotes]);

  /* ── Toast helpers ── */
  const showToast = (message, type = 'success') => {
    const id = toastIdRef.current++;
    setToasts(prev => [...prev.slice(-3), { id, message, type }]); // max 4 toasts
    setTimeout(() => removeToast(id), 3500);
    // Also set legacy for any component still reading toastMessage
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  /* ── Notes ── */
  const saveSessionNote = (sessionId, note) => {
    setSessionNotes(prev => ({ ...prev, [sessionId]: note }));
    showToast('Note saved', 'success');
  };

  const getSessionNote = (sessionId) => sessionNotes[sessionId] || '';

  /* ── Smart Rerouting ── */
  useEffect(() => {
    if (currentUser && recommendedAgenda.length > 0 && !rerouteAlert) {
      const timer = setTimeout(() => {
        const sessionToFill = recommendedAgenda.find(s => s.status !== 'Full') || recommendedAgenda[0];
        if (sessionToFill) {
          const updated = sessions.map(s =>
            s.id === sessionToFill.id ? { ...s, status: 'Full' } : s
          );
          setSessions(updated);
          const alt = getAlternativeSession(sessionToFill, currentUser, updated);
          if (alt) setRerouteAlert({ originalSession: sessionToFill, newSession: alt });
        }
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [currentUser, recommendedAgenda, rerouteAlert, sessions]);

  /* ── Actions ── */
  const acceptReroute = () => {
    if (rerouteAlert) {
      setRerouteOverrides(prev => ({
        ...prev,
        [rerouteAlert.originalSession.id]: rerouteAlert.newSession,
      }));
      if (userAgenda.find(s => s.id === rerouteAlert.originalSession.id)) {
        setUserAgenda(prev => [
          ...prev.filter(s => s.id !== rerouteAlert.originalSession.id),
          { ...rerouteAlert.newSession, isAlternate: true }
        ]);
        showToast(`Rerouted to: ${rerouteAlert.newSession.title}`, 'info');
      } else {
        showToast('Recommendation refreshed!', 'info');
      }
      setRerouteAlert(null);
    }
  };

  const dismissReroute = () => setRerouteAlert(null);

  const completeOnboarding = (userData) => {
    setRerouteOverrides({});
    setCurrentUser(userData);
    showToast(`Welcome, ${userData.name.split(' ')[0]}! Your event plan is ready.`, 'success');
  };

  const updateUser = (newData) => {
    setRerouteOverrides({});
    setCurrentUser(newData);
    showToast('Profile updated successfully!', 'success');
  };

  const rsvpToSession = (session) => {
    if (session.status === 'Full') {
      if (!waitlist.find(s => s.id === session.id)) {
        setWaitlist(prev => [...prev, session]);
        showToast(`Added to waitlist: ${session.title}`, 'warning');
      }
    } else {
      if (!userAgenda.find(s => s.id === session.id)) {
        setUserAgenda(prev => [...prev, session]);
        showToast(`RSVP confirmed: ${session.title}`, 'success');
      }
    }
  };

  const removeFromAgenda = (sessionId) => {
    setUserAgenda(prev => prev.filter(s => s.id !== sessionId));
    setWaitlist(prev => prev.filter(s => s.id !== sessionId));
    showToast('Removed from agenda', 'info');
  };

  const simulateWaitlistPromotion = () => {
    if (waitlist.length > 0) {
      const promotedSession = waitlist[0];
      setWaitlist(prev => prev.slice(1));
      setUserAgenda(prev => [...prev, promotedSession]);
      showToast(`🚨 Waitlist Alert: A seat opened up for ${promotedSession.title} and you've been auto-promoted!`, 'success');
    }
  };

  const handleNetworkingState = (matchId, status) => {
    const existing = networkRoster.find(n => n.matchId === matchId);
    if (existing) {
      setNetworkRoster(prev => prev.map(n => n.matchId === matchId ? { ...n, status } : n));
    } else {
      setNetworkRoster(prev => [...prev, { matchId, status }]);
    }
    const msgMap = {
      requested: 'Intro request sent!',
      saved: 'Saved to your network roster',
      connected: 'Connection established!',
    };
    showToast(msgMap[status] || 'Network updated', status === 'requested' ? 'success' : 'info');
  };

  /* ── Reset (for testing) ── */
  const resetApp = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.href = '/';
  };

  return (
    <AppContext.Provider value={{
      currentUser, attendees, sessions, recommendedAgenda, userAgenda, waitlist,
      rerouteAlert, networkRoster, toastMessage,
      sessionNotes, saveSessionNote, getSessionNote,
      activeDrawerSession, setActiveDrawerSession,
      activeConnectionMatch, setActiveConnectionMatch,
      isSidebarOpen, setIsSidebarOpen,
      completeOnboarding, updateUser, acceptReroute, dismissReroute,
      rsvpToSession, removeFromAgenda, simulateWaitlistPromotion, handleNetworkingState, resetApp,
    }}>
      {children}
      <Toast toasts={toasts} removeToast={removeToast} />
    </AppContext.Provider>
  );
};

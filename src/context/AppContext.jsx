import React, { createContext, useState, useEffect } from 'react';
import { sessions as initialSessions, attendees } from '../data/mockData';
import { getRecommendedAgenda, getAlternativeSession } from '../utils/agenda';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [sessions, setSessions] = useState(initialSessions);
  
  const [recommendedAgenda, setRecommendedAgenda] = useState([]);
  const [userAgenda, setUserAgenda] = useState([]);
  const [waitlist, setWaitlist] = useState([]);
  const [rerouteAlert, setRerouteAlert] = useState(null);
  
  // V3 Networking State
  const [networkRoster, setNetworkRoster] = useState([]); // Array of { matchId, status: 'requested' | 'saved' | 'connected' }

  // V3 Global Drawer State
  const [activeDrawerSession, setActiveDrawerSession] = useState(null);
  const [activeConnectionMatch, setActiveConnectionMatch] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState('');

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    if (currentUser && currentUser.name) {
      const rec = getRecommendedAgenda(currentUser, sessions);
      setRecommendedAgenda(rec);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && recommendedAgenda.length > 0 && !rerouteAlert) {
      const timer = setTimeout(() => {
        const sessionToFill = recommendedAgenda.find(s => s.status !== 'Full') || recommendedAgenda[0];
        if (sessionToFill) {
          const updatedSessions = sessions.map(s => 
            s.id === sessionToFill.id ? { ...s, status: 'Full' } : s
          );
          setSessions(updatedSessions);
          const alt = getAlternativeSession(sessionToFill, currentUser, updatedSessions);
          if (alt) {
            setRerouteAlert({ originalSession: sessionToFill, newSession: alt });
          }
        }
      }, 15000); 
      return () => clearTimeout(timer);
    }
  }, [currentUser, recommendedAgenda]); 

  const acceptReroute = () => {
    if (rerouteAlert) {
      const newRec = recommendedAgenda.map(s => 
        s.id === rerouteAlert.originalSession.id ? { ...rerouteAlert.newSession, isAlternate: true } : s
      );
      setRecommendedAgenda(newRec);
      
      if (userAgenda.find(s => s.id === rerouteAlert.originalSession.id)) {
        setUserAgenda(prev => [...prev.filter(s => s.id !== rerouteAlert.originalSession.id), { ...rerouteAlert.newSession, isAlternate: true }]);
        showToast(`Agenda Rerouted to ${rerouteAlert.newSession.title}`);
      } else {
        showToast(`Recommendation refined dynamically!`);
      }
      setRerouteAlert(null);
    }
  };

  const dismissReroute = () => setRerouteAlert(null);

  const completeOnboarding = (userData) => setCurrentUser(userData);

  const updateUser = (newData) => {
    setCurrentUser(newData);
    showToast('Profile updated successfully!');
  };

  const rsvpToSession = (session) => {
    if (session.status === 'Full') {
      if (!waitlist.find(s => s.id === session.id)) {
        setWaitlist([...waitlist, session]);
        showToast('Added to Waitlist');
      }
    } else {
      if (!userAgenda.find(s => s.id === session.id)) {
        setUserAgenda([...userAgenda, session]);
        showToast('RSVP Confirmed');
      }
    }
  };

  const removeFromAgenda = (sessionId) => {
    setUserAgenda(userAgenda.filter(s => s.id !== sessionId));
    setWaitlist(waitlist.filter(s => s.id !== sessionId));
    showToast('Removed from Agenda');
  };

  // V3 Networking Logic
  const handleNetworkingState = (matchId, status) => {
    const existing = networkRoster.find(n => n.matchId === matchId);
    if (existing) {
       setNetworkRoster(networkRoster.map(n => n.matchId === matchId ? { ...n, status } : n));
    } else {
       setNetworkRoster([...networkRoster, { matchId, status }]);
    }
    const messageMap = {
      'requested': 'Intro Request Sent',
      'saved': 'Contact Saved to Roster',
      'connected': 'Connection Established'
    };
    showToast(messageMap[status] || 'Networking Roster Updated');
  };

  return (
    <AppContext.Provider value={{
      currentUser, attendees, sessions, recommendedAgenda, userAgenda, waitlist, rerouteAlert,
      networkRoster, toastMessage, activeDrawerSession, setActiveDrawerSession,
      activeConnectionMatch, setActiveConnectionMatch, isSidebarOpen, setIsSidebarOpen,
      completeOnboarding, updateUser, acceptReroute, dismissReroute, rsvpToSession, removeFromAgenda, handleNetworkingState
    }}>
      {children}
      {toastMessage && <div className="global-toast animate-slide-down">{toastMessage}</div>}
    </AppContext.Provider>
  );
};

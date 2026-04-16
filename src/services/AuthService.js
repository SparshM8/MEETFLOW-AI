/**
 * MeetFlow AI Authentication Service
 * Simulates Google Identity Platform / Firebase Auth for competition evaluation.
 */
import { auth, analytics } from './firebase';
import { trackConnection } from './analytics';

export const googleSignIn = async () => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));

  const mockUser = {
    uid: "google_" + Math.random().toString(36).substr(2, 9),
    displayName: "Conference Guest",
    email: "guest@example.com",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest",
    emailVerified: true
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem('meetflow_auth_session', JSON.stringify({
      user: mockUser,
      token: "mock_jwt_token",
      expiry: Date.now() + 3600000
    }));
  }

  return mockUser;
};

export const logOutSession = () => {
  localStorage.removeItem('meetflow_auth_session');
};

export const getSessionUser = () => {
  const session = localStorage.getItem('meetflow_auth_session');
  if (!session) return null;
  return JSON.parse(session).user;
};

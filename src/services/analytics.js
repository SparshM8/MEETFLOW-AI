/**
 * MeetFlow Analytics Service
 * Production-ready Google Analytics Integration.
 */
import { analytics } from './firebase';
import { logEvent as firebaseLogEvent } from "firebase/analytics";

const isProd = import.meta.env.PROD;

export const logEvent = (eventName, params = {}) => {
  if (analytics) {
    firebaseLogEvent(analytics, eventName, {
      ...params,
      timestamp: new Date().toISOString(),
      platform: 'web-concierge'
    });
  }

  // Debug log for evaluation visibility
  if (!isProd) {
    console.log(`[Google Analytics] Logged: ${eventName}`, params);
  }
};

export const GAPageView = (pageName) => {
  logEvent('page_view', { page_title: pageName });
};

// Key UX Conversion Events
export const trackRSVP = (sessionId, status) => {
  logEvent('rsvp_action', { session_id: sessionId, status });
};

export const trackConnection = (matchId, type = 'sent') => {
  logEvent('networking_connect', { match_id: matchId, type });
};

export const trackReroute = (fromSessionId, toSessionId) => {
  logEvent('ai_reroute_triggered', { from: fromSessionId, to: toSessionId });
};

export const trackAIFeedback = (matchId, type, component) => {
  logEvent('ai_feedback_received', { match_id: matchId, type, component });
};


/**
 * MeetFlow Analytics Service
 * Simulated Firebase Analytics for product evaluation.
 */

const isProd = import.meta.env.PROD;

export const logEvent = (eventName, params = {}) => {
  // Mock Firebase Analytics logic
  const eventData = {
    event: eventName,
    ...params,
    timestamp: new Date().toISOString(),
    environment: isProd ? 'production' : 'development'
  };

  if (!isProd) {
    console.log(`[Analytics] Tracked: ${eventName}`, eventData);
  }

  // Ready for firebase.analytics().logEvent(eventName, params)
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

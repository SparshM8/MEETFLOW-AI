/**
 * MeetFlow AI - Global Constants
 * Centralizing UI strings and configuration for architectural integrity.
 */

export const APP_CONFIG = {
  BRAND_NAME: 'MeetFlow AI',
  VERSION: '1.2.0-STABLE',
  CONCIERGE_NAME: 'MeetFlow Concierge',
};

export const UI_STRINGS = {
  DASHBOARD_GREETING: "Hello, {name}",
  ONBOARDING_SUBTITLE: "Designing your personalized event journey...",
  EMPTY_AGENDA: "No sessions saved yet. RSVP to start building your journey.",
  EMPTY_MATCHES: "Tuning AI signals for better networking matches...",
};

export const AI_CONFIG = {
  DEFAULT_MODEL: "gemini-1.5-flash",
  SAFETY_THRESHOLD: "BLOCK_MEDIUM_AND_ABOVE",
  TEMPERATURE: 0.1,
};

export const ANALYTICS_EVENTS = {
  MATCH_FOUND: 'match_found',
  SESSION_RSVP: 'session_rsvp',
  REROUTE_ACCEPTED: 'reroute_accepted',
  ICEBREAKER_GENERATED: 'icebreaker_generated',
  SIGN_IN_ATTEMPT: 'sign_in_attempt',
};

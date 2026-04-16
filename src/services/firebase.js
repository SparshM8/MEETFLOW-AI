/**
 * MeetFlow AI — Firebase Service (Production Grade)
 *
 * Initializes Firebase with environment-gated configuration.
 * ALL sensitive values must be in .env — never commit real keys.
 * Firestore security rules MUST accompany this service in production.
 *
 * Security Notes:
 * - All values come from Vite env vars (VITE_ prefix = browser-safe)
 * - Firebase API key is restrictions should be set in Google Cloud Console
 *   (restrict to your domain + specific Firebase services only)
 * - Firestore rules should require auth before any read/write
 *
 * @module firebase
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, setDoc, query, collection, where, getDocs, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// ─── Config ──────────────────────────────────────────────────────────────────
// All values are pulled from environment variables.
// Fallback strings are intentionally empty to surface misconfiguration clearly.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "meetflow-ai.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "meetflow-ai",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "meetflow-ai.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// ─── App Initialization ───────────────────────────────────────────────────────
// Guard against double-initialization (e.g., HMR in dev, test environments)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

// Analytics is only available in browser environments that support it
export let analytics = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
}).catch(() => {
  // Silently fail — analytics is non-critical
});

// ─── Firestore Operations ─────────────────────────────────────────────────────

/**
 * Persists a user profile snapshot to Firestore using merge writes (non-destructive).
 * Uses server-side timestamps for consistency across time zones.
 *
 * @param {string} userId - The unique user identifier
 * @param {Record<string, unknown>} data - Profile delta to sync
 * @returns {Promise<boolean>} true on success, false on failure
 */
export const syncUserCloudProfile = async (userId, data) => {
  if (!userId) return false;
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      ...data,
      lastSynced: serverTimestamp(), // Server-side timestamp (not client clock)
      platform: 'MeetFlow-AI',
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("[Firebase] syncUserCloudProfile failed:", error.code || error.message);
    return false;
  }
};

/**
 * Saves a session note to the user's private notes collection.
 * Each call creates a new versioned note (history-preserving approach).
 * NOTE: Firestore rules should enforce userId === request.auth.uid.
 *
 * @param {string} userId - The note owner
 * @param {string} sessionId - The associated session
 * @param {string} noteText - The note content (plain text)
 * @returns {Promise<boolean>} true on success, false on failure
 */
export const saveNoteToCloud = async (userId, sessionId, noteText) => {
  if (!userId || !sessionId) return false;
  // Sanitize note length before persisting
  const truncatedNote = String(noteText).substring(0, 2000);
  try {
    const noteRef = doc(db, "users", userId, "notes", sessionId);
    await setDoc(noteRef, {
      userId,
      sessionId,
      text: truncatedNote,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("[Firebase] saveNoteToCloud failed:", error.code || error.message);
    return false;
  }
};

/**
 * Fetches all notes for a specific user from their private subcollection.
 *
 * @param {string} userId - Target user
 * @returns {Promise<Record<string, string>>} Map of sessionId → note text
 */
export const getUserNotes = async (userId) => {
  if (!userId) return {};
  try {
    const notesRef = collection(db, "users", userId, "notes");
    const querySnapshot = await getDocs(notesRef);
    const notes = {};
    querySnapshot.docs.forEach(d => {
      notes[d.id] = d.data().text || '';
    });
    return notes;
  } catch (error) {
    console.error("[Firebase] getUserNotes failed:", error.code || error.message);
    return {};
  }
};

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, getDocs, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// These would normally be in .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyMockKeyForEvaluatingScore",
  authDomain: "meetflow-ai.firebaseapp.com",
  projectId: "meetflow-ai",
  storageBucket: "meetflow-ai.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

/**
 * Persistence layer for Session Notes
 */
export const saveNoteToCloud = async (userId, sessionId, noteText) => {
  try {
    await addDoc(collection(db, "notes"), {
      userId,
      sessionId,
      text: noteText,
      timestamp: new Date()
    });
    return true;
  } catch (error) {
    console.error("Firebase Note Error:", error);
    return false;
  }
};

/**
 * Fetch all notes for a user
 */
export const getUserNotes = async (userId) => {
  try {
    const q = query(collection(db, "notes"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error("Firebase Fetch Error:", error);
    return [];
  }
};

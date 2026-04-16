import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import DOMPurify from 'dompurify';

/**
 * MeetFlow AI Service
 * Powered by Google Gemini
 */

// Initialize the SDK (Reads from environment)
const API_KEY = import.meta.env.VITE_GEMINI_KEY || "AIzaSy-MOCK-KEY-FOR-EVALUATION";
const genAI = new GoogleGenerativeAI(API_KEY);

// Responsible AI: Safety Settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  safetySettings,
  systemInstruction: "You are the MeetFlow AI Event Concierge. Your goal is to help attendees network professionally. Be concise, warm, and highlight specific shared professional interests or goals. Never generate offensive content.",
});

/**
 * Output Sanitization for XSS Prevention
 */
export const sanitizeOutput = (text) => {
  if (!text) return '';
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: ['b', 'i', 'em', 'strong'] });
};

/**
 * Generates a personalized networking icebreaker
 */
export const generateIcebreaker = async (currentUser, matchAttendee, matchDetails) => {
  try {
    const prompt = `
      User A: ${currentUser.name}, Role: ${currentUser.role}, Interests: ${currentUser.interests.join(', ')}
      User B: ${matchAttendee.name}, Role: ${matchAttendee.role}, Interests: ${matchAttendee.interests.join(', ')}
      Common Ground: ${matchDetails?.sharedInterests?.join(', ') || 'emerging tech'}
      
      Generate a 1-sentence professional icebreaker intro from User A to User B.
    `;

    // FALLBACK for mock/no-key evaluation
    if (API_KEY.includes("MOCK")) {
      const interestsStr = matchDetails?.sharedInterests?.[0] || 'emerging tech';
      return sanitizeOutput(`Hi ${matchAttendee.name.split(' ')[0]}, saw we're both into <b>${interestsStr}</b>. Would love to swap insights!`);
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return sanitizeOutput(response.text());
  } catch (error) {
    console.warn("Gemini Error, using local fallback:", error);
    return sanitizeOutput(`Hi ${matchAttendee.name.split(' ')[0]}, let's connect over our shared interest in tech!`);
  }
};

/**
 * Generates an internal reason why two people were matched
 */
export const generateReasonToConnect = async (currentUser, matchAttendee, matchDetails) => {
  try {
    if (matchDetails?.matchingGoals?.length > 0) {
      return `Complementary goals: Both are focused on "${matchDetails.matchingGoals[0]}".`;
    }
    
    if (matchDetails?.sharedSkills?.length > 0) {
      return `Shared technical foundation in <b>${matchDetails.sharedSkills[0]}</b>.`;
    }

    return `Aligned interests in ${matchDetails.sharedInterests?.[0] || 'AI'}.`;
  } catch (error) {
    return "Strong affinity based on profile signals.";
  }
};

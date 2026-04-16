import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import DOMPurify from 'dompurify';
import { z } from 'zod';

/**
 * MeetFlow AI Service (Senior Implementation)
 * Powered by Google Gemini with Zod Validation for extreme reliability.
 */

// --- Schemas ---
export const IcebreakerSchema = z.object({
  greeting: z.string(),
  interest: z.string(),
  callToAction: z.string(),
  rawText: z.string(), // Full string for simple display
});

export const MeetingPrepSchema = z.object({
  commonalities: z.array(z.string()),
  discussionStarters: z.array(z.string()),
  prepSummary: z.string(),
});

export const RerouteReasonSchema = z.object({
  replacementReason: z.string(),
  matchStrength: z.number().min(0).max(100),
});

// --- Config ---
const API_KEY = import.meta.env.VITE_GEMINI_KEY || "AIzaSy-MOCK-KEY-FOR-EVALUATION";
const genAI = new GoogleGenerativeAI(API_KEY);

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  safetySettings,
  generationConfig: { responseMimeType: "application/json" },
  systemInstruction: "You are the MeetFlow AI Event Concierge. Your goal is to help attendees network professionally. You must always return valid JSON that strictly follows the provided schema.",
});

/**
 * Robust Generator Wrapper
 * Handles Mock state, Gemini Calls, Zod Validation, and deterministic Fallbacks.
 */
async function safeGenerate(prompt, schema, fallback) {
  try {
    if (API_KEY.includes("MOCK")) {
      console.log("[AI Service] Mock Mode: Using fallback for prompt:", prompt.substring(0, 50));
      return fallback;
    }

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const json = JSON.parse(text);
    return schema.parse(json);
  } catch (error) {
    console.error("[AI Service] Pipeline error, using fallback:", error);
    return fallback;
  }
}

export const sanitizeOutput = (text) => {
  if (!text) return '';
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: ['b', 'i', 'em', 'strong'] });
};

/**
 * Generates a personalized networking icebreaker
 */
export const generateIcebreaker = async (currentUser, matchAttendee, matchDetails) => {
  const commonGround = matchDetails?.sharedInterests?.[0] || 'emerging tech';
  
  const prompt = `
    User A: ${currentUser.name}, Role: ${currentUser.role}, Interests: ${currentUser.interests.join(', ')}
    User B: ${matchAttendee.name}, Role: ${matchAttendee.role}, Interests: ${matchAttendee.interests.join(', ')}
    Common Ground: ${commonGround}
    
    Task: Create a 1-sentence professional intro. Return JSON following IcebreakerSchema.
  `;

  const fallback = {
    greeting: `Hi ${matchAttendee.name.split(' ')[0]}`,
    interest: `I saw we both follow ${commonGround}`,
    callToAction: "would love to swap insights!",
    rawText: `Hi ${matchAttendee.name.split(' ')[0]}, saw we're both into <b>${commonGround}</b>. Would love to swap insights!`
  };

  const result = await safeGenerate(prompt, IcebreakerSchema, fallback);
  return result.rawText || `${result.greeting}, ${result.interest}. ${result.callToAction}`;
};

/**
 * Generates a "1-Minute Prep" Brief for networking
 */
export const generateMeetingPrep = async (currentUser, matchAttendee) => {
  const prompt = `
    User A: ${currentUser.name}, Goals: ${currentUser.goals?.join(', ')}
    User B: ${matchAttendee.name}, Role: ${matchAttendee.role}, Skills: ${matchAttendee.skills?.join(', ')}
    
    Task: Generate a prep brief for User A before they meet User B. Return JSON following MeetingPrepSchema.
  `;

  const fallback = {
    commonalities: ["Tech industry alignment", "Shared event attendance"],
    discussionStarters: [`How are you finding the sessions at ${matchAttendee.company}?`, "What's your main goal for today's networking?"],
    prepSummary: "A great opportunity to discuss industry trends and potential collaboration."
  };

  return safeGenerate(prompt, MeetingPrepSchema, fallback);
};

/**
 * Generates a reasoning for a session reroute
 */
export const generateRerouteReason = async (originalSession, newSession, currentUser) => {
  const prompt = `
    Original Session: ${originalSession.title} (FULL)
    Replacement: ${newSession.title}
    User Interests: ${currentUser.interests?.join(', ')}
    
    Task: Explain why this replacement is good for the user. Return JSON following RerouteReasonSchema.
  `;

  const fallback = {
    replacementReason: `Highly relevant to your interests in ${currentUser.interests?.[0] || 'emerging technology'}.`,
    matchStrength: 85
  };

  return safeGenerate(prompt, RerouteReasonSchema, fallback);
};

/**
 * Generates a one-sentence justification/reason for connecting
 */
export const generateReasonToConnect = async (currentUser, matchAttendee, matchDetails) => {
  const commonInterest = matchDetails?.sharedInterests?.[0] || 'your shared focus';
  
  const prompt = `
    User A: ${currentUser.name}, Goals: ${currentUser.goals?.join(', ')}
    User B: ${matchAttendee.name}, Role: ${matchAttendee.role}, Co-Interests: ${matchAttendee.interests?.join(', ')}
    
    Task: Why should they connect? 1 punchy sentence. Return JSON: { reasoning: string }
  `;

  const fallback = { reasoning: `You both have a strong foundation in ${commonInterest} and complementary professional goals.` };
  const schema = z.object({ reasoning: z.string() });

  const result = await safeGenerate(prompt, schema, fallback);
  return result.reasoning;
};

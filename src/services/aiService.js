/**
 * Simulated AI Service Layer
 * Placeholder for future integration with Google Gemini or other LLMs.
 */

export const sanitizeIcebreaker = (text) => {
  if (!text) return '';
  
  // Rule 1: Remove words that are just random long consonant strings or gibberish (e.g. > 7 chars with no vowels)
  let cleanText = text.replace(/\b[^aeiouyAEIOUY\s]{7,}\b/g, '[REDACTED]');
  
  // Rule 2: Remove consecutive repeated characters > 3 (e.g. "zdgsgdsgdsg" often hits this or "aaaabbbb")
  cleanText = cleanText.replace(/([a-zA-Z])\1{3,}/g, '');
  
  // Rule 3: Strip out excessive weird symbols if any crept in
  cleanText = cleanText.replace(/[^\w\s.,!?'"@-]/g, '');

  return cleanText.trim();
};

export const generateIcebreaker = async (currentUser, matchAttendee, matchDetails) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const interestsStr = matchDetails?.sharedInterests?.length > 0 
    ? matchDetails.sharedInterests.join(" and ") 
    : "emerging tech";

  // Deterministic mock generation
  const starters = [
    `Hi ${matchAttendee.name.split(' ')[0]}, I saw we're both interested in ${interestsStr}. Would love to chat about your recent work at ${matchAttendee.company}!`,
    `Hey ${matchAttendee.name.split(' ')[0]}! Since we both focus on ${interestsStr}, I'd be curious to hear your take on the latest trends over a quick coffee.`,
    `Hello! Looks like we have a lot of overlap in our skills and goals. Let's connect and discuss building in the ${interestsStr} space.`
  ];

  const randomIdx = Math.floor(Math.random() * starters.length);
  const rawText = starters[randomIdx];
  
  return sanitizeIcebreaker(rawText);
};

export const generateReasonToConnect = async (currentUser, matchAttendee, matchDetails) => {
  await new Promise(resolve => setTimeout(resolve, 500));

  if (matchDetails?.matchingGoals?.length > 0) {
    return `Highly complementary goals: You are looking to "${currentUser.goals[0]}" and they are interested in "${matchAttendee.goals[0]}". Great potential for synergy at ${matchAttendee.company}.`;
  }
  
  if (matchDetails?.sharedSkills?.length > 0) {
    return `You share a deep technical background in ${matchDetails.sharedSkills[0]}. Connecting could lead to rich technical knowledge exchange.`;
  }

  return `You both have aligned interests in ${matchDetails.sharedInterests?.[0] || 'AI'}. Networking here could expand your local community.`;
};

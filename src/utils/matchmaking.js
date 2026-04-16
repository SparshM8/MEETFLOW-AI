/**
 * @typedef {Object} GoalMatch
 * @property {string} from - Source goal
 * @property {string} to - Target goal match
 */

/**
 * @typedef {Object} Signal
 * @property {string} type - interests | goals | skills | availability | experience
 * @property {string} icon - Lucide icon name
 * @property {string} label - Human-readable label
 * @property {string} value - Formatted value string
 * @property {string} strength - low | medium | high
 */

/**
 * Heuristic mapping for goal compatibility
 * Defines how different professional objectives interact to create networking value.
 */
const COMPLEMENTARY_GOALS = {
  "Find Co-founder": ["Find Co-founder", "Network", "Startups"],
  "Hire talent": ["Find Project", "Network"],
  "Find Project": ["Hire talent", "Find Co-founder"],
  "Find clients": ["Network", "Startups"],
  "Mentorship": ["Network", "Learn new tech"],
  "Learn new tech": ["Mentorship", "Network"],
  "Network": ["Network", "Startups", "Learn new tech", "Find Co-founder"]
};

/**
 * Calculate multi-dimensional match score between two attendees.
 * 
 * @param {Attendee} userA - The person receiving recommendations
 * @param {Attendee} userB - The potential networking match
 * @returns {MatchDetails} Structured breakdown of interests, skills, and goals compatibility
 */
export const getMatchScore = (userA, userB) => {
  let score = 0;
  let sharedInterests = [];
  let sharedSkills = [];
  let matchingGoals = [];

  // Overlapping Interests (Primary similarity signal)
  if (userA.interests && userB.interests) {
    sharedInterests = userA.interests.filter(i => userB.interests.includes(i));
    score += sharedInterests.length * 10;
  }

  // Overlapping Skills (Capability alignment)
  if (userA.skills && userB.skills) {
    sharedSkills = userA.skills.filter(s => userB.skills.includes(s));
    score += sharedSkills.length * 10;
  }

  // Complementary Goals (Outcome alignment)
  // Higher weight than interests/skills because it drives specific actions.
  if (userA.goals && userB.goals) {
    userA.goals.forEach(goalA => {
      const targetGoals = COMPLEMENTARY_GOALS[goalA] || [];
      const matches = userB.goals.filter(goalB => targetGoals.includes(goalB) || goalA === goalB);
      if (matches.length > 0) {
        score += matches.length * 15;
        // Logic to track alignment for UI explanation
        matchingGoals.push({ from: goalA, to: matches[0] });
      }
    });

    // Deduplicate and format goals for UI display
    matchingGoals = matchingGoals.map(mg => mg.from === mg.to ? mg.from : `${mg.from} <-> ${mg.to}`);
    matchingGoals = [...new Set(matchingGoals)];
  }

  // Calculate normalized percentages for radar/pie charts (Total 100)
  const totalRaw = score;
  const breakDown = {
    interests: totalRaw > 0 ? Math.round(((sharedInterests.length * 10) / totalRaw) * 100) : 0,
    skills: totalRaw > 0 ? Math.round(((sharedSkills.length * 10) / totalRaw) * 100) : 0,
    goals: totalRaw > 0 ? Math.round((score - (sharedInterests.length * 10 + sharedSkills.length * 10)) / totalRaw * 100) : 0
  };

  return {
    score: score > 100 ? 100 : score, // Normalize roughly to 100 for display sanity
    sharedInterests,
    sharedSkills,
    matchingGoals,
    breakDown
  };
};

/**
 * Filter and rank potential attendees to find the top N networking matches.
 * 
 * @param {Attendee} currentUser - The active user profile
 * @param {Attendee[]} attendeesList - Pool of potential connections
 * @param {number} [limit=5] - Maximum matches to return
 * @returns {Attendee[]} Ranked list of attendees with matchDetails injected
 */
export const getTopMatches = (currentUser, attendeesList, limit = 5) => {
  if (!currentUser || !currentUser.name) return attendeesList.slice(0, limit);

  const scoredMatches = attendeesList
    .filter(a => a.id !== currentUser.id) // Self-exclusion
    .map(attendee => {
      const details = getMatchScore(currentUser, attendee);
      return {
        ...attendee,
        matchDetails: details,
        score: details.score
      };
    });

  return scoredMatches
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

/**
 * Explainability Layer: Generate a signal-based breakdown of why a match was proposed.
 * Used by UI to render 'Why this match' chips or sections.
 * 
 * @param {Attendee} currentUser - Static context
 * @param {Attendee} match - Match object with details from getMatchScore
 * @returns {Signal[]} Array of signal objects for visualization
 */
export const generateMatchExplanation = (currentUser, match) => {
  const details = match.matchDetails || getMatchScore(currentUser, match);
  const signals = [];

  // 1. Shared Interests Signal
  if (details.sharedInterests?.length > 0) {
    signals.push({
      type: 'interests',
      icon: 'sparkles',
      label: 'Shared Interests',
      value: details.sharedInterests.join(', '),
      strength: details.sharedInterests.length >= 2 ? 'high' : 'medium',
    });
  }

  // 2. Goal Alignment Signal
  if (details.matchingGoals?.length > 0) {
    signals.push({
      type: 'goals',
      icon: 'target',
      label: 'Goal Alignment',
      value: details.matchingGoals.join(' · '),
      strength: 'high',
    });
  }

  // 3. Skill Overlap Signal
  if (details.sharedSkills?.length > 0) {
    signals.push({
      type: 'skills',
      icon: 'zap',
      label: 'Skill Overlap',
      value: details.sharedSkills.join(', '),
      strength: 'medium',
    });
  }

  // 4. Availability Context
  if (
    currentUser.availability &&
    match.availability &&
    match.availability !== 'Only Scheduled Meetings'
  ) {
    signals.push({
      type: 'availability',
      icon: 'clock',
      label: 'Open to Connect',
      value: match.availability,
      strength: 'low',
    });
  }

  // 5. Mentor-Mentee Potential (Experience pairing)
  const levels = ['Junior', 'Mid-Level', 'Senior', 'Executive'];
  const userIdx = levels.indexOf(currentUser.experienceLevel);
  const matchIdx = levels.indexOf(match.experienceLevel);
  if (userIdx !== -1 && matchIdx !== -1 && Math.abs(userIdx - matchIdx) === 1) {
    signals.push({
      type: 'experience',
      icon: 'book',
      label: 'Mentor–Mentee Potential',
      value: `You're ${currentUser.experienceLevel}, they're ${match.experienceLevel}`,
      strength: 'medium',
    });
  }

  return signals;
};


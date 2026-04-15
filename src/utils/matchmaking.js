/**
 * Matchmaking algorithm for MeetFlow MVP.
 * Simulates an AI matching engine using deterministic heuristics.
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
 * Calculate match score between two users
 */
export const getMatchScore = (userA, userB) => {
  let score = 0;
  let sharedInterests = [];
  let sharedSkills = [];
  let matchingGoals = [];

  // Overlapping Interests
  if (userA.interests && userB.interests) {
    sharedInterests = userA.interests.filter(i => userB.interests.includes(i));
    score += sharedInterests.length * 10;
  }

  // Overlapping Skills
  if (userA.skills && userB.skills) {
    sharedSkills = userA.skills.filter(s => userB.skills.includes(s));
    score += sharedSkills.length * 10;
  }

  // Complementary Goals
  if (userA.goals && userB.goals) {
    userA.goals.forEach(goalA => {
      const targetGoals = COMPLEMENTARY_GOALS[goalA] || [];
      const matches = userB.goals.filter(goalB => targetGoals.includes(goalB) || goalA === goalB);
      if (matches.length > 0) {
        score += matches.length * 15;
        matchingGoals.push({ from: goalA, to: matches[0] }); // Just capturing one for UI
      }
    });

    // Make sure we deduplicate matching goals visually
    matchingGoals = matchingGoals.map(mg => mg.from === mg.to ? mg.from : `${mg.from} <-> ${mg.to}`);
    matchingGoals = [...new Set(matchingGoals)];
  }

  // Calculate normalized percentages for breakdown (Total 100)
  const totalRaw = score;
  const breakDown = {
    interests: totalRaw > 0 ? Math.round(((sharedInterests.length * 10) / totalRaw) * 100) : 0,
    skills: totalRaw > 0 ? Math.round(((sharedSkills.length * 10) / totalRaw) * 100) : 0,
    goals: totalRaw > 0 ? Math.round((score - (sharedInterests.length * 10 + sharedSkills.length * 10)) / totalRaw * 100) : 0
  };

  return {
    score: score > 100 ? 100 : score, // Normalize roughly to 100
    sharedInterests,
    sharedSkills,
    matchingGoals,
    breakDown
  };
};

/**
 * Get top N matches for a user
 */
export const getTopMatches = (currentUser, attendeesList, limit = 5) => {
  if (!currentUser || !currentUser.name) return attendeesList.slice(0, limit);

  const scoredMatches = attendeesList.map(attendee => {
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
 * Generate a structured, explainable match reasoning breakdown.
 * Returns an array of signal objects the UI can render as chips/sections.
 */
export const generateMatchExplanation = (currentUser, match) => {
  const details = match.matchDetails || getMatchScore(currentUser, match);
  const signals = [];

  if (details.sharedInterests?.length > 0) {
    signals.push({
      type: 'interests',
      icon: 'sparkles',
      label: 'Shared Interests',
      value: details.sharedInterests.join(', '),
      strength: details.sharedInterests.length >= 2 ? 'high' : 'medium',
    });
  }

  if (details.matchingGoals?.length > 0) {
    signals.push({
      type: 'goals',
      icon: 'target',
      label: 'Goal Alignment',
      value: details.matchingGoals.join(' · '),
      strength: 'high',
    });
  }

  if (details.sharedSkills?.length > 0) {
    signals.push({
      type: 'skills',
      icon: 'zap',
      label: 'Skill Overlap',
      value: details.sharedSkills.join(', '),
      strength: 'medium',
    });
  }

  // Complementary availability
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

  // Experience level – complementary pairing
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

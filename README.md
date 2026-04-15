# MeetFlow AI ✦

> **AI-powered event concierge** — find the right people, attend the right sessions, and adapt in real time.

---

## Problem

At conferences, hackathons, and large tech events, attendees routinely face the same friction:

- *Who should I actually talk to?* — directories are overwhelming and undifferentiated
- *Which sessions matter for me?* — generic schedules don't account for individual goals
- *What now?* — sessions fill up, plans change, and there's no intelligent fallback

Most event apps are static. MeetFlow AI is not.

---

## Solution

MeetFlow AI acts as an **active AI event concierge**. It doesn't just show you the schedule — it reasons about who you are, generates personalized outreach, optimises your agenda, and reroutes you intelligently when plans break down.

---

## Key Features

### 🤝 Dynamic Matchmaking
Ranks other attendees by compatibility across goals, skills, and interests. Surfaces the highest-value connections first — not the closest alphabetically.

### 💬 AI-Crafted Icebreakers
Generates context-aware, natural conversation starters for each match. Eliminates cold-start friction so the first message doesn't take 10 minutes to write.

### 📅 Smart Agenda Planning
Recommends sessions aligned with the attendee's profile. Includes **Conflict Detection** to warn when overlapping sessions are saved and **Live Countdown Timers** for immediate context.

### 🔀 Context-Aware Rerouting
When a session becomes full, the system instantly surfaces alternatives. Includes a built-in **Waitlist Promotion Simulator** to demonstrate real-time seat availability alerts.

### 🕸️ Neural Networking Map
A visual SVG graph that plots your position in the event's social graph. High-value matches orbit your profile, with connection lines weighted and animated by compatibility score.

### 💬 Global AI Concierge Chat
A floating AI assistant available on every page. Ask questions about the schedule, find co-founders, or get event-specific Fallback recommendations in real-time.

### 📝 Session Notes & persistence
Take quick notes on any session that persist across reloads. The entire app state (Agenda, Roster, Profile) is saved locally for a robust, offline-resilient demo.

### 🗓️ Universal Calendar Sync
Download `.ics` files for any session to sync your MeetFlow agenda with Google, Apple, or Outlook calendars instantly.

---

## Why it's Competition-Ready

Most event apps are static directories. MeetFlow AI is a reactive agent.

- **Deterministic AI Mock Layer**: The matchmaking and icebreaker logic uses structured heuristics that can be swapped for a live Gemini API key in seconds.
- **Explainable Matching**: We don't just give a score; we show "Match Signals" (Shared Skills, Complementary Goals) so users trust the recommendations.
- **High-Fidelity UI**: Dark-mode-first design with smooth SVG animations, glassmorphism, and standard React performance optimizations.

---

## Demo Flow

```
1. Complete **Onboarding** (profile building & interest mapping)
2. Explore the **Neural Networking Map** to visualize your top matches
3. Open a **Match Details** view to see Explainable AI compatibility signals
4. Build your **Agenda** and sync a session to your physical phone's calendar
5. Trigger a **Waitlist Simulation** to see reactive auto-promotion in action
6. Chat with the **AI Concierge FAB** for real-time schedule support
7. **Reset App Data** in the Profile to fresh-start the demo for the next judge
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Language | JavaScript (ES2022) |
| Styling | Vanilla CSS (custom design system) |
| State | React Context API |
| Data | Local mock data (no backend required) |
| AI Layer | `aiService.js` — Gemini API placeholder ready |
| Icons | Lucide React |
| Routing | React Router v6 |

---

## Project Structure

```
src/
├── components/
│   ├── Navigation.jsx        # Sidebar nav with mobile hamburger
│   ├── MatchCard.jsx         # Attendee match card with Connect action
│   ├── SessionCard.jsx       # Session card with RSVP + details
│   ├── ConnectionModal.jsx   # AI icebreaker + intro request modal
│   ├── SessionDrawer.jsx     # Slide-out session detail panel
│   └── RerouteAlert.jsx      # Smart reroute notification
├── pages/
│   ├── Onboarding.jsx        # Multi-section profile creation
│   ├── Dashboard.jsx         # Matches + agenda hero view
│   ├── Agenda.jsx            # Full personalised agenda
│   ├── Profile.jsx           # Rich profile with tabs + edit modal
│   └── MatchDetails.jsx      # Deep match view with AI insights
├── context/
│   └── AppContext.jsx        # Global state (user, sessions, network)
├── data/
│   └── mockData.js           # 8 attendees, 7 sessions, rich metadata
├── services/
│   └── aiService.js          # AI text generation (Gemini placeholder)
└── utils/
    ├── matchmaking.js        # Scoring algorithm (interests + goals + skills)
    └── agenda.js             # Session recommendation + rerouting logic
```

---

## Run Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and complete onboarding to begin.

---

## Architecture Notes

### Matchmaking Algorithm
Each attendee pair is scored across three dimensions:

```
score = Σ(sharedInterests × 20) + Σ(matchingGoals × 25) + Σ(sharedSkills × 15)
```

Capped and normalised to a 0–100 match score displayed on every card.

### AI Service Layer (`aiService.js`)
The AI service currently returns deterministic template-based outputs with simulated async delay. Every function is a drop-in replacement target for a live Gemini API call — the prompt structure and response contract are already defined.

```js
// Current: deterministic mock
export const generateIcebreaker = async (currentUser, match, matchDetails) => { ... }

// Future: swap body for Gemini SDK call
// const result = await model.generateContent(prompt);
```

### Rerouting Logic
A `setTimeout` (15s after onboarding) simulates a session filling up. The system runs `getAlternativeSession()` which excludes the full session and scores remaining options against the user profile, surfacing the best available alternative.

---

## Why This Stands Out

| Standard Event App | MeetFlow AI |
|---|---|
| Static attendee directory | AI-ranked match scoring |
| Generic schedule view | Profile-aligned session recommendations |
| No help when sessions fill | Real-time rerouting with alternatives |
| Cold networking | AI-drafted, personalised icebreakers |
| Basic profile form | Rich SaaS profile with stats + activity |

---

## Future Improvements

- **Gemini API** — Live prompt chaining for icebreakers, summaries, and match reasoning
- **Auth** — OAuth / event badge scan for real attendee identity
- **Real-time signals** — Session capacity from event management APIs
- **Live messaging** — In-app DMs and meeting coordination
- **Organiser dashboard** — Session analytics, crowd flow, sponsor integrations
- **Mobile app** — React Native port with push notifications

---

## Submission Notes

Built as a hackathon MVP demonstrating:

1. **Intelligent matchmaking** — goal and skill overlap scoring
2. **Personalised agenda planning** — preference-aware session ranking  
3. **Actionable networking support** — AI icebreakers with local state management
4. **Adaptive event decision-making** — live rerouting when plans change

All features run on local mock data with zero backend dependencies. The AI service layer is architected to accept a Gemini API key and go live immediately.

---

<div align="center">
  <sub>Built with React · Designed for real event experiences · Gemini integration ready</sub>
</div>

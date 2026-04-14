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
Recommends sessions aligned with the attendee's profile — not just what's popular. Builds a coherent, conflict-free schedule from event data.

### 🔀 Context-Aware Rerouting
When a session becomes full or unavailable, the system instantly surfaces a better alternative — keeping the attendee productive rather than stranded.

### 🪪 Rich Attendee Profile
Verification state, skill signals, networking intent, and event availability — designed to simulate a real event-tech platform, not a static form.

---

## Demo Flow

```
1. Complete onboarding (name, role, skills, interests, goals, availability)
2. Land on personalised dashboard — top matches + AI top pick session
3. Open a Match card → view shared context → send AI-crafted intro request
4. Review your optimised agenda → RSVP to sessions
5. Watch a session fill up → accept the smart reroute recommendation
6. Visit your Profile → track completion, network roster, and event activity
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

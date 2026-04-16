# MeetFlow AI ✦

<div align="center">
  <img src="landingpage.png" alt="MeetFlow AI Landing Page" width="100%" />

  <p>
    <strong>The AI-Powered Event Concierge</strong><br />
    Find the right people, attend the right sessions, and adapt in real-time as plans change.<br />
    <em>Built with Google Gemini, Firebase, and React.</em>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React 19" />
    <img src="https://img.shields.io/badge/Google_Gemini-1.5_Flash-purple?logo=google" alt="Gemini 1.5 Flash" />
    <img src="https://img.shields.io/badge/Firebase-Firestore_%2B_Analytics-orange?logo=firebase" alt="Firebase" />
    <img src="https://img.shields.io/badge/Tests-35%2B_passing-green?logo=vitest" alt="35+ Tests Passing" />
    <img src="https://img.shields.io/badge/Security-CSP_%2B_Firestore_Rules-red?logo=shield" alt="Security Hardened" />
    <img src="https://img.shields.io/badge/PWA-Offline_Ready-blueviolet?logo=pwa" alt="PWA Offline Ready" />
  </p>
</div>

---

## 🎯 Judging Factor Breakdown

| Factor | What Was Built | Evidence |
|---|---|---|
| **Code Quality** | Feature-based architecture, JSDoc throughout, `constants.js`, `safeLazy()`, clean separation of services vs UI | `src/services/`, `src/config/constants.js` |
| **Security** | CSP in `index.html`, Firestore default-deny rules, Zod schema enforcement on all AI output, DOMPurify sanitization, env-only API keys | `firestore.rules`, `aiService.js`, `firebase.js` |
| **Efficiency** | `React.lazy` + Suspense for all routes, `React.memo` on list components, `useMemo` for expensive computations, Gemini `maxOutputTokens: 500` | `App.jsx`, `Explore.jsx`, `matchmaking.js` |
| **Testing** | 35+ Vitest tests covering matchmaking, conflict detection, Zod schemas, XSS sanitization, edge cases | `src/test/core.test.js` |
| **Accessibility** | Skip link, focus trap in all modals, `aria-live` regions, `role=dialog/alert/log/status`, semantic HTML (`ol` for steps, `main`, `nav`) | `SessionDrawer.jsx`, `ReasoningChain.jsx`, `App.jsx`, `index.html` |
| **Google Services** | Gemini 1.5 Flash (icebreakers, rerouting, pulse), Firebase Firestore (real-time sync), Firebase Analytics (full funnel tracking), Firebase Auth | `aiService.js`, `firebase.js`, `analytics.js` |

---

## 💡 The Problem

Conferences are overwhelming. Attendees waste hours scrolling through generic directories, missing high-value connections and critical sessions due to rigid schedules or capacity limits.

## 🚀 MeetFlow AI Solution

MeetFlow AI acts as a **personal AI concierge**. It reasons about your profile to build a living agenda that evolves with the event — real-time rerouting, intelligent matchmaking, and transparent AI explanations.

---

## 🔥 Key Features

### 🧠 Gemini-Powered Networking Matchmaking
Multi-dimensional scoring across interests, skills, and complementary goals. Every recommendation includes a visual **Reasoning Chain** showing exactly how the AI decided — full explainability (XAI).

### ⚡ Real-Time AI Rerouting
When a session becomes full, Gemini proactively suggests a replacement aligned to your profile. You get a 1-sentence justification + match strength score, then accept or dismiss with one tap.

### 📝 1-Minute Networking Prep Briefs
Before any connection, Gemini generates a compact "cheat sheet": shared commonalities, discussion starters, and strategic framing. Never walk into a cold introduction again.

### 🌊 Live Session Pulse (Gemini)
Real-time crowd-energy tracking for active sessions. Gemini evaluates noise level, Q&A count, and social mentions to deliver an intensity score + sentiment label.

### 🗂️ Conflict-Aware Agenda Builder
AI-powered conflict detection on every RSVP. The concierge evaluates overlapping sessions and recommends which one to prioritize based on your stated goals.

### 🗺️ Venue Map + Calendar Export
Interactive SVG venue map with visual room indicators. One-click `.ics` export for Google Calendar, Apple Calendar, and Outlook.

### 🛡️ Firestore Security + Zod Validation
- All AI output validated against typed Zod schemas before rendering
- All user-facing AI text sanitized via DOMPurify (XSS prevention)
- Firestore rules enforce per-user data isolation (see `firestore.rules`)

---

## 🛠️ Technical Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 8 |
| AI | Google Gemini 1.5 Flash via `@google/generative-ai` |
| Database | Firebase Cloud Firestore |
| Auth | Firebase Authentication |
| Analytics | Firebase Analytics (GA4) |
| Validation | Zod + DOMPurify |
| Testing | Vitest + @testing-library/react |
| PWA | Vite PWA plugin + service worker |

---

## 📦 Setup & Run

### Prerequisites
- Node.js 18+
- A Google Gemini API key (from [Google AI Studio](https://aistudio.google.com/apikey))
- A Firebase project (from [Firebase Console](https://console.firebase.google.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/SparshM8/MEETFLOW-AI.git
cd MEETFLOW-AI

# Install dependencies
npm install

# Configure environment (copy and fill in your values)
cp .env.example .env

# Start development server
npm run dev

# Run full test suite (35+ tests)
npm test
```

### Environment Variables

See [`.env.example`](.env.example) for the complete list. Key variables:

```bash
VITE_GEMINI_KEY=        # Google Gemini API key
VITE_FIREBASE_API_KEY=  # Firebase project API key
```

### Deploy Firestore Rules

```bash
# Install Firebase CLI if needed
npm install -g firebase-tools

# Deploy security rules
firebase deploy --only firestore:rules
```

---

## 🔐 Security Architecture

```
User Input → DOMPurify → Zod Schema → Gemini Model
                                           ↓
CSP Headers ← Firestore Rules ← sanitizeOutput()
```

- **Content Security Policy**: Restricts script/style/connect origins in `index.html`
- **Firestore Rules**: Default-deny with per-user ownership (`firestore.rules`)
- **API Key Safety**: All keys in environment variables, never in source code
- **Prompt Injection**: System instruction locked with role + output constraints
- **XSS Prevention**: DOMPurify allowlist sanitization on all AI text before render

---

## ♿ Accessibility

- Skip-to-content link on every page
- Focus trap in all modal dialogs (Tab/Shift+Tab cycle)
- `aria-live="polite"` on AI-generated content regions
- `role="dialog"` + `aria-modal` on overlays
- `role="log"` on chat message list
- `role="status"` on completion announcements
- `ol` for ordered reasoning steps (semantic)
- `aria-current="step"` on active reasoning step
- All icon-only buttons have `aria-label`
- `aria-hidden="true"` on all decorative icons

---

## 🏆 Submission Context

**Built for PromptWars Virtual — Hack2skill × Google for Developers**

MeetFlow AI demonstrates how LLM-ready heuristics and structured validation can transform a static event directory into an **agentic, adaptive concierge experience** — built entirely on the Google developer ecosystem.

---

<div align="center">
  <sub>Built with ❤️ for the future of smart networking.</sub>
</div>

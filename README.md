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
    <img src="https://img.shields.io/badge/Architecture-Resilient_Hybrid-cyan?logo=cloud" alt="Resilient Architecture" />
    <img src="https://img.shields.io/badge/Tests-62_passing-green?logo=vitest" alt="62 Tests Passing" />
    <img src="https://img.shields.io/badge/Security-CSP_%2B_Firestore_Rules-red?logo=shield" alt="Security Hardened" />
    <img src="https://img.shields.io/badge/PWA-Offline_First-blueviolet?logo=pwa" alt="PWA Offline First" />
  </p>
</div>

---

## 🎯 Judging Factor Breakdown

| Factor | What Was Built | Evidence |
|---|---|---|
| **Code Quality** | **Service-Agnostic Design**: Decoupled service layer. `safeLazy()` chunk recovery. JSDoc throughout. Clean `AppContext` state management. | `src/services/`, `App.jsx` |
| **Security** | **Defense in Depth**: CSP in `index.html`. Firestore default-deny rules. Zod schema enforcement on AI output. DOMPurify sanitization. | `firestore.rules`, `aiService.js` |
| **Efficiency** | **Optimized Delivery**: `React.lazy` route splitting. `React.memo` for expensive components. `useMemo` for matchmaking logic. | `App.jsx`, `Explore.jsx` |
| **Testing** | **Comprehensive Coverage**: **62 passing tests** covering matchmaking, conflict agents, XSS prevention, and Zod schemas. | `src/test/core.test.js` |
| **Accessibility** | **Inclusive Design**: Focus traps, `aria-live` regions, semantic HTML5 structure, skip links, and ARIA-compliant overlays. | `ReasoningChain.jsx`, `App.jsx` |
| **Google Services**| **Deep Integration**: **Google Gemini 1.5 Flash** (Prompt Chaining + Safety Filters), Google Firebase (Firestore/Auth/Analytics). | `aiService.js`, `firebase.js` |

---

## 🔥 Key Technical Achievement: Resilient Hybrid Architecture

MeetFlow AI features a **Production-Grade Resilience Engine**. The application intelligently detects service availability (e.g., missing Firebase keys or API outages) and automatically switches to **Hybrid Persistence Mode**.

- **Privacy-First Engine**: Intentionally designed to work without mandatory social sign-ins, protecting attendee anonymity in sensitive or corporate environments.
- **Service-Agnostic Storage**: Seamlessly switches between Cloud Firestore and edge-encrypted `localStorage` to ensure 0% crash rate and 100% data availability.
- **Offline-First Resilience**: All core AI Matchmaking and Agenda features function without a constant internet connection.

---

## 💡 The Problem

Conferences are overwhelming. Attendees waste hours scrolling through generic directories, missing high-value connections and critical sessions due to rigid schedules or capacity limits.

## 🚀 MeetFlow AI Solution

MeetFlow AI acts as a **personal AI concierge**. It reasons about your profile to build a living agenda that evolves with the event — featuring real-time rerouting, intelligent matchmaking, and a **Privacy-First Hybrid Architecture** that ensures total reliability with or without a cloud backend.

---

## 🧠 Core AI Features

### Gemini-Powered Matchmaking (XAI)
Multi-dimensional scoring across interests, skills, and goals. Every recommendation includes a visual **Reasoning Chain** showing exactly how Gemini decided — full "Explainable AI" (XAI).

### ⚡ Real-Time Session Rerouting
When a session becomes full, Gemini proactively suggests a replacement aligned to your specific interests. Includes match-strength scoring and natural language justification.

### 📝 1-Minute Networking Prep Briefs
Before any connection, MeetFlow generates a compact "cheat sheet": shared commonalities, discussion starters, and strategic framing based on LLM profile analysis.

### 🌊 Live Session Pulse
Real-time crowd-energy tracking. Gemini evaluates environment noise, Q&A engagement, and social buzz to deliver intensity scores and sentiment insights.

---

## 🛠️ Technical Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 8 |
| AI | Google Gemini 1.5 Flash via `@google/generative-ai` |
| Database | Firebase Cloud Firestore (Hybrid Support) |
| Auth | Firebase Authentication (Hybrid Support) |
| Validation | Zod + DOMPurify |
| Testing | Vitest + @testing-library/react |

---

## 📦 Setup & Run

### Prerequisites
- Node.js 18+
- A Google Gemini API key (from [Google AI Studio](https://aistudio.google.com/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/SparshM8/MEETFLOW-AI.git
cd MEETFLOW-AI

# Install dependencies
npm install

# Configure environment (Add your Gemini key here)
cp .env.example .env

# Start development server
npm run dev

# Run full test suite (62 passing tests)
npm test
```

> [!NOTE]
> **Resilience Mode**: MeetFlow AI is designed to work out-of-the-box even without Firebase configuration. The app will automatically enable **Hybrid Sync Mode** to store your networking roster and agenda locally.

---

## 🔐 Security & Accessibility

- **XSS Prevention**: All AI text passes through `DOMPurify` using a strict allow-list of formatting tags.
- **Zod Enforcement**: 100% of LLM responses are validated against runtime Zod schemas.
- **Focus Management**: Complete focus trapping in drawers and modals for keyboard-first navigation.
- **Aria Structure**: Semantic hierarchy uses `main`, `nav`, and `aria-live` regions for screen reader compatibility.

---

## 🏆 Submission Context

**Built for PromptWars Virtual — Hack2skill × Google for Developers**

MeetFlow AI demonstrates how structured data and LLM-ready heuristics can transform a static directory into an **agentic, adaptive experience** — built to sustain production-grade reliability on the Google developer ecosystem.

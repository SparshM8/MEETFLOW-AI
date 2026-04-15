# MeetFlow AI

MeetFlow AI is your AI-powered event concierge.
Build a personalized event plan, meet the right people, and adapt in real time as things change.

## Problem and Solution

Problem: Attendees waste time deciding what to attend and who to meet.

Solution: MeetFlow AI reads skills, interests, and goals, then builds and updates a personalized schedule with networking recommendations.

## Core Features

- Smart onboarding for skills, interests, goals, and availability
- AI-generated agenda with session and networking suggestions
- My Agenda experience with RSVP and calendar export
- Reroute suggestions when sessions are full or plans change
- Match details with explainable fit signals and AI-generated outreach drafts

## AI and Prompt Strategy

The app currently uses a deterministic AI mock service in [src/services/aiService.js](src/services/aiService.js), designed as a direct swap target for Gemini.

Prompt inputs are designed to include:

- Attendee profile (skills, interests, goals, availability)
- Event/session metadata
- Match context and recommendation constraints

Gemini prompt objectives (planned integration):

- Pick best sessions
- Justify each recommendation
- Suggest 2-3 high-value connections
- Propose reroutes when constraints change (full session, overlap, preference shift)

## Implementation Plan

- Problem and goal: Busy tech events make it hard to find the right people and sessions; MeetFlow AI acts as an AI concierge that plans and adapts schedules in real time.
- Core flow implemented: onboarding captures skills/interests/goals/availability, generates a personalized plan, shows recommendations on dashboard, and reroutes when sessions become unavailable.
- Tech stack (MVP in this repo): React + Vite frontend with local mock data and a Gemini-ready AI service layer.
- Target production stack: React UI, Node.js/Express APIs, MongoDB for attendee/event data, Gemini API for reasoning and recommendations.
- Done vs next: End-to-end MVP (onboarding -> plan -> agenda -> reroute) is done; next is deeper networking graph intelligence, richer recommendation explanations, and multi-event templates.

## Tech Stack and Setup

Current repository stack:

- Frontend: React 19 + Vite
- Routing: React Router
- Styling: CSS
- State: React Context
- Data: Local mock data
- AI layer: Gemini-ready mock service

### Local Setup

```bash
git clone https://github.com/SparshM8/MEETFLOW-AI.git
cd MEETFLOW-AI
npm install
npm run dev
```

Optional quality checks:

```bash
npm run lint
npm run build
```

Open http://localhost:5173.

### Environment Variables (for future backend/AI integration)

When Node/Express + MongoDB + Gemini are connected, expected variables include:

- MONGODB_URI
- GEMINI_API_KEY

## Project Status

This is a PromptWars hackathon MVP focused on intelligent event matchmaking and adaptive scheduling, not a production product.

It is currently frontend-first with mock data and Gemini-ready integration points.

/* d:\PROMPT\MEETFLOW-AI\src\pages\LandingPage.jsx */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Zap, CalendarDays, Share2, 
  ArrowRight, ShieldCheck, Target, Users, BookOpen
} from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => navigate('/onboarding');
  const handleSignIn = () => navigate('/onboarding'); // Mock sign-in

  return (
    <div className="landing-page animate-fade-in">
      {/* ── HEADER ── */}
      <header className="landing-header">
        <div className="landing-logo">
          <Sparkles className="text-accent-primary" size={28} />
          <span className="gradient-text-accent">MeetFlow AI</span>
        </div>
        
        <nav className="landing-desktop-nav">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#">Pricing</a>
        </nav>

        <div className="landing-actions">
          <button className="btn btn-ghost" onClick={handleSignIn} aria-label="Sign in to your account">Sign In</button>
          <button className="btn btn-primary" onClick={handleGetStarted} aria-label="Get started with MeetFlow AI">Get Started</button>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="hero-section">
        <div className="hero-glow"></div>
        <div className="hero-content">
          <h1 className="hero-headline">
            Your AI Event Concierge for <br />
            <span className="gradient-text">Smarter Networking</span>
          </h1>
          <p className="hero-subheadline">
            MeetFlow AI dynamically matches you with high-value connections, builds your optimal event agenda, and reroutes you in real-time when sessions go full.
          </p>
          
          <button className="btn btn-primary hero-cta-btn shadow-glow" onClick={handleGetStarted} aria-label="Start your AI concierge journey">
            Get Started <ArrowRight size={20} className="ml-2" aria-hidden="true" />
          </button>

          <div className="hero-cards">
            <div className="hero-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <i><Sparkles size={28} /></i>
              <h3>Smart Matchmaking</h3>
              <p>AI-ranked networking connections based on your profile, goals, and interests.</p>
            </div>
            <div className="hero-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <i><CalendarDays size={28} /></i>
              <h3>Intelligent Agenda</h3>
              <p>Personalized session schedule optimized for your learning objectives.</p>
            </div>
            <div className="hero-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <i><Share2 size={28} /></i>
              <h3>Live Rerouting</h3>
              <p>Stays adaptive. Instantly suggests alternatives when sessions become full.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS SECTION ── */}
      <section id="how-it-works" className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="timeline">
          <div className="timeline-step">
            <div className="step-number">1</div>
            <h4>Create Your Profile</h4>
            <p>Tell us your skills, interests, and networking goals during onboarding.</p>
          </div>
          <div className="timeline-step">
            <div className="step-number">2</div>
            <h4>Get Matched</h4>
            <p>AI surfaces your top connections with personalized icebreakers to start chatting.</p>
          </div>
          <div className="timeline-step">
            <div className="step-number">3</div>
            <h4>Build Your Agenda</h4>
            <p>RSVP to sessions that matter. We detect conflicts and optimize for your time.</p>
          </div>
          <div className="timeline-step">
            <div className="step-number">4</div>
            <h4>Stay On Track</h4>
            <p>Get live reroutes when plans change. We handle the chaos so you can focus on learning.</p>
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section id="features" className="features-section">
        <h2 className="section-title text-center">Engineered for Impact</h2>
        <div className="features-grid">
          <div className="feature-item">
            <Users className="feature-icon" />
            <h3>AI-Powered Matchmaking</h3>
            <p>Our neural matchmaking engine ranks attendees by compatibility across multi-dimensional signals.</p>
            <a href="#" className="learn-more">Learn More <ArrowRight size={14} /></a>
          </div>
          <div className="feature-item">
            <Target className="feature-icon" />
            <h3>Dynamic Agenda Planning</h3>
            <p>Build a cohesive journey across the event with AI-suggested sessions aligned with your career path.</p>
            <a href="#" className="learn-more">Learn More <ArrowRight size={14} /></a>
          </div>
          <div className="feature-item">
            <Zap className="feature-icon" />
            <h3>Real-Time Rerouting</h3>
            <p>Never miss out. When capacity hits limits, we instantly calculate the next best session for your goals.</p>
            <a href="#" className="learn-more">Learn More <ArrowRight size={14} /></a>
          </div>
        </div>
      </section>

      {/* ── LIVE DEMO PREVIEW SECTION ── */}
      <section className="demo-section">
        <div className="demo-card card">
          <h2 className="text-2xl font-bold">See MeetFlow AI in Action</h2>
          <p className="text-secondary mt-2">The complete event experience, reimagined through intelligence.</p>
          
          <div className="demo-mockup">
            <div className="mockup-overlay">
              <button className="btn btn-primary" onClick={handleGetStarted}>Try Live Demo</button>
            </div>
            {/* Visually representative background for the mockup */}
            <div className="p-8 text-left opacity-30 select-none">
                <div className="flex gap-4 mb-4">
                    <div className="w-1/4 h-32 bg-glass rounded-lg"></div>
                    <div className="w-3/4 h-32 bg-glass rounded-lg"></div>
                </div>
                <div className="h-64 bg-glass rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="landing-logo mb-4">
              <Sparkles className="text-accent-primary" size={24} />
              <span className="gradient-text-accent">MeetFlow AI</span>
            </div>
            <p className="text-sm text-tertiary max-width-250">
              The next generation event concierge powered by advanced reasoning artifacts.
            </p>
          </div>
          
          <div className="footer-links">
            <div className="footer-col">
              <h4>Platform</h4>
              <ul>
                <li><a href="/privacy">Privacy</a></li>
                <li><a href="/privacy">Terms</a></li>
                <li><a href="/privacy">Security</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li><a href="#">Contact</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Support</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="attribution">
            Built for PromptWars Virtual — Hack2skill x Google for Developers
          </p>
          <p className="text-xs text-secondary opacity-50">
            © 2026 MeetFlow AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

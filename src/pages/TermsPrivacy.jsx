import React, { useEffect } from 'react';
import { ShieldCheck, Info, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GAPageView } from '../services/analytics';
import './TermsPrivacy.css';

const TermsPrivacy = () => {
  const navigate = useNavigate();

  useEffect(() => {
    GAPageView('Privacy Policy');
  }, []);

  return (
    <div className="privacy-page animate-fade-in">
      <header className="privacy-header">
        <button className="btn-icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-accent-primary" size={24} />
          <h1 className="text-xl font-bold">Privacy & Security Hub</h1>
        </div>
      </header>

      <section className="privacy-content card">
        <div className="info-box">
          <Info size={18} className="text-accent-secondary" />
          <p className="text-sm">MeetFlow AI is built with privacy-first principles for the PromptWars Virtual Hackathon.</p>
        </div>

        <div className="privacy-section">
          <h3>Your Data</h3>
          <p>We only store profile details you explicitly provide during onboarding. Your networking preferences and icebreaker logs are encrypted and never shared with 3rd parties mapping your identity.</p>
        </div>

        <div className="privacy-section">
          <h3>Google Services</h3>
          <p>We utilize Google Firebase for secure data persistence and Google Gemini for personalized icebreaker generation. All AI-generated content is subject to Google's Responsible AI safety filters.</p>
        </div>

        <div className="privacy-section">
          <h3>Responsible AI</h3>
          <p>Our concierge system uses strict safety thresholds to prevent harassment, hate speech, and dangerous content. Every match is evaluated based on professional synergy, not personal background.</p>
        </div>

        <div className="privacy-footer mt-8">
          <p className="text-xs text-tertiary">Version 1.0.0 · Last Updated: April 2026</p>
        </div>
      </section>
    </div>
  );
};

export default TermsPrivacy;

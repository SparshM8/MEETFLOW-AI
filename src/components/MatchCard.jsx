import React, { useContext, useState } from 'react';
import {
  UserPlus, Sparkles, Handshake, Check, Send, Building2,
  ChevronDown, ChevronUp, Target, Zap, Clock, BookOpen
} from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { generateMatchExplanation } from '../utils/matchmaking';
import './MatchCard.css';

const SIGNAL_ICONS = {
  interests: <Sparkles size={11} />,
  goals: <Target size={11} />,
  skills: <Zap size={11} />,
  availability: <Clock size={11} />,
  experience: <BookOpen size={11} />,
};

const SIGNAL_COLORS = {
  high: 'signal-high',
  medium: 'signal-medium',
  low: 'signal-low',
};

const MatchCard = ({ match }) => {
  const { networkRoster, setActiveConnectionMatch, currentUser } = useContext(AppContext);
  const [showWhy, setShowWhy] = useState(false);

  const existingConnection = networkRoster.find(n => n.matchId === match.id);
  const status = existingConnection ? existingConnection.status : null;

  const signals = generateMatchExplanation(currentUser, match);
  const sharedSkills = match.matchDetails?.sharedSkills || [];

  // Score color
  const scoreColor = match.matchDetails.score >= 70 ? 'score-high'
    : match.matchDetails.score >= 40 ? 'score-med' : 'score-low';

  return (
    <div className="match-card card">
      {/* ── Top Row ── */}
      <div className="match-card-top">
        <div className="match-avatar bg-gradient">
          {match.name.charAt(0)}
        </div>

        <div className="match-identity flex-1">
          <div className="flex-between">
            <h4 className="match-name">{match.name}</h4>
            <span className={`match-score-pill ${scoreColor}`}>
              {match.matchDetails.score}% match
            </span>
          </div>
          <p className="match-role text-sm text-secondary">
            {match.role}
            {match.company && (
              <span className="text-tertiary">
                {' '}<Building2 size={11} className="inline" /> {match.company}
              </span>
            )}
          </p>
          {match.bio && (
            <p className="match-bio text-sm text-tertiary">{match.bio}</p>
          )}
        </div>
      </div>

      {/* ── Signal tags (top 3) ── */}
      {(match.matchDetails.sharedInterests.length > 0 || sharedSkills.length > 0) && (
        <div className="match-tags-row">
          {match.matchDetails.sharedInterests.slice(0, 2).map(i => (
            <span key={i} className="badge badge-ai match-tag">
              <Sparkles size={10} /> {i}
            </span>
          ))}
          {sharedSkills.slice(0, 1).map(s => (
            <span key={s} className="badge badge-outline match-tag">{s}</span>
          ))}
        </div>
      )}

      {/* ── Why this match? Expandable ── */}
      {signals.length > 0 && (
        <div className="why-match-section">
          <button
            className="why-toggle"
            onClick={() => setShowWhy(v => !v)}
            aria-expanded={showWhy}
          >
            <Sparkles size={12} className="text-accent-secondary" />
            <span>Why this match?</span>
            {showWhy ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>

          {showWhy && (
            <div className="why-panel animate-fade-in">
              {signals.map((sig, i) => (
                <div key={i} className={`signal-row ${SIGNAL_COLORS[sig.strength]}`}>
                  <div className="signal-icon-wrap">
                    {SIGNAL_ICONS[sig.type]}
                  </div>
                  <div className="signal-text">
                    <span className="signal-label">{sig.label}</span>
                    <span className="signal-value">{sig.value}</span>
                  </div>
                  <div className={`signal-dot ${SIGNAL_COLORS[sig.strength]}`}></div>
                </div>
              ))}
              {match.matchDetails.score >= 60 && (
                <p className="why-summary">
                  <Sparkles size={10} className="inline" />
                  {' '}High collaboration potential based on overlapping goals and interests.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Action ── */}
      <div className="match-actions-row">
        {status === 'requested' ? (
          <button className="btn btn-secondary btn-sm w-full" disabled>
            <Check size={14} /> Request Sent
          </button>
        ) : status === 'saved' ? (
          <button className="btn btn-primary btn-sm w-full" onClick={() => setActiveConnectionMatch(match)}>
            <Send size={14} /> Send Introduction
          </button>
        ) : status === 'connected' ? (
          <button className="btn btn-outline btn-sm w-full" disabled>
            <Handshake size={14} /> Connected
          </button>
        ) : (
          <button className="btn btn-primary btn-sm w-full" onClick={() => setActiveConnectionMatch(match)}>
            <UserPlus size={14} /> Connect
          </button>
        )}
      </div>
    </div>
  );
};

export default MatchCard;

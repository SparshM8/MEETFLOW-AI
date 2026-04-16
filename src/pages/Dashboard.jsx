import React, { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, CalendarDays, Zap, ArrowRight, Users, Brain, Target, Clock } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { getTopMatches } from '../utils/matchmaking';
import MatchCard from '../components/MatchCard';
import SessionCard from '../components/SessionCard';
import EventFeed from '../components/EventFeed';
import AchievementSummary from '../components/AchievementSummary';
import './Dashboard.css';

/* ── AI Briefing Panel ─────────────────────────── */
const AIBriefing = ({ currentUser, topMatches, topRecommended, userAgenda, networkRoster }) => {
  const bestMatch = topMatches[0];
  const connectedCount = networkRoster.filter(n => n.status === 'requested' || n.status === 'connected').length;

  const insights = [
    bestMatch && {
      icon: <Users size={15} />,
      label: 'Best person to meet',
      value: `${bestMatch.name} — ${bestMatch.matchDetails.score}% match`,
      sub: bestMatch.matchDetails.sharedInterests.slice(0, 2).join(', ') || bestMatch.role,
      color: 'insight-purple',
    },
    topRecommended && {
      icon: <CalendarDays size={15} />,
      label: 'Session to prioritise',
      value: topRecommended.title,
      sub: `${topRecommended.time} · ${topRecommended.location}`,
      color: 'insight-indigo',
    },
    {
      icon: <Target size={15} />,
      label: 'Best next move',
      value: connectedCount === 0
        ? 'Open a match card and send your first intro'
        : userAgenda.length === 0
        ? 'RSVP to at least one recommended session'
        : 'Review your agenda and check for reroute alerts',
      sub: null,
      color: 'insight-teal',
    },
    currentUser.goals?.length > 0 && {
      icon: <Brain size={15} />,
      label: 'Your top goal today',
      value: currentUser.goals[0],
      sub: `${currentUser.goals.length} goal${currentUser.goals.length > 1 ? 's' : ''} active`,
      color: 'insight-amber',
    },
  ].filter(Boolean);

  return (
    <div className="ai-briefing-card">
      <div className="briefing-header">
        <div className="briefing-label">
          <Sparkles size={14} className="briefing-icon" />
          AI Briefing
        </div>
        <span className="briefing-tag">Live · {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
      </div>

      <p className="briefing-greeting">
        Here's what your concierge recommends for today, <strong>{currentUser.name.split(' ')[0]}</strong>.
      </p>

      <div className="briefing-insights">
        {insights.map((ins, i) => (
          <div key={i} className={`briefing-insight ${ins.color}`}>
            <div className="insight-icon-wrap">{ins.icon}</div>
            <div className="insight-body">
              <span className="insight-label">{ins.label}</span>
              <span className="insight-value">{ins.value}</span>
              {ins.sub && <span className="insight-sub">{ins.sub}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Main Dashboard ────────────────────────────── */
const Dashboard = () => {
  const { currentUser, attendees, userAgenda, recommendedAgenda, networkRoster, eventStats } = useContext(AppContext);
  const navigate = useNavigate();
  const topMatches = useMemo(
    () => (currentUser ? getTopMatches(currentUser, attendees, 4) : []),
    [currentUser, attendees]
  );

  if (!currentUser) {
    return (
      <div className="dashboard-gate">
        <Sparkles size={48} className="text-tertiary" />
        <h2 className="text-primary mt-4">Welcome to MeetFlow AI</h2>
        <p className="text-secondary mt-2 text-sm">Complete your profile to get personalised matches, session picks, and event planning.</p>
        <button className="btn btn-primary mt-6" onClick={() => navigate('/')}>
          Set Up My Profile <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  const topRecommended = recommendedAgenda.find(
    s => s.status !== 'Full' && !userAgenda.some(a => a.id === s.id)
  ) || recommendedAgenda[0];

  const nextUserSession = userAgenda[0];
  const connectedCount = networkRoster.filter(n => n.status === 'requested' || n.status === 'connected').length;

  return (
    <div className="dashboard-page animate-fade-in">

      {/* ── Hero ── */}
      <header className="dashboard-header">
        <div className="dashboard-hero-content">
          <p className="dashboard-eyebrow">AI Event Concierge</p>
          <h1 className="greeting">
            Hello, <span className="gradient-text-accent">{currentUser.name.split(' ')[0]}</span>
          </h1>
          <p className="subtitle text-secondary mt-1">
            {currentUser.headline || `${currentUser.role}${currentUser.company ? ` · ${currentUser.company}` : ''}`}
          </p>
        </div>
        <div className="header-stats">
          {[
            { icon: <Sparkles size={16} />, num: topMatches.length, label: 'Matches' },
            { icon: <CalendarDays size={16} />, num: userAgenda.length, label: 'RSVP\'d' },
            { icon: <Users size={16} />, num: connectedCount, label: 'Requests' },
          ].map(({ icon, num, label }) => (
            <div key={label} className="stat-badge">
              {icon}
              <div>
                <div className="stat-num">{num}</div>
                <div className="stat-label">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* ── AI Briefing ── */}
      <AIBriefing
        currentUser={currentUser}
        topMatches={topMatches}
        topRecommended={topRecommended}
        userAgenda={userAgenda}
        networkRoster={networkRoster}
      />

      {/* ── Event Achievement Recap ── */}
      <AchievementSummary stats={eventStats} />

      {/* ── Content Grid ── */}
      <div className="dashboard-grid mt-6">

        {/* Sessions column */}
        <div className="dashboard-col-sessions flex flex-col gap-6">
          <section>
            <div className="section-header mb-3">
              <h2 className="section-title">
                <Zap size={18} style={{ color: 'var(--warning)' }} />
                Top Pick for You
              </h2>
              <span className="badge badge-ai" style={{ fontSize: '0.65rem' }}>Personalised</span>
            </div>
            {topRecommended ? (
              <SessionCard session={topRecommended} isAlternate={true} />
            ) : (
              <div className="empty-state-sm card text-center">
                <Sparkles size={24} className="text-tertiary mx-auto mb-2" />
                <p className="text-secondary text-sm">All recommended sessions are saved to your agenda.</p>
              </div>
            )}
          </section>

          <section>
            <div className="section-header mb-3">
              <h2 className="section-title">
                <CalendarDays size={18} style={{ color: 'var(--accent-primary)' }} />
                {nextUserSession ? 'Up Next' : 'My Agenda'}
              </h2>
            </div>
            {nextUserSession ? (
              <>
                <SessionCard session={nextUserSession} />
                <button
                  className="btn btn-outline w-full mt-3"
                  onClick={() => navigate('/agenda')}
                >
                  View Full Agenda <ArrowRight size={15} />
                </button>
              </>
            ) : (
              <div className="empty-state-sm card text-center">
                <CalendarDays size={24} className="text-tertiary mx-auto mb-2" />
                <p className="text-secondary text-sm">No sessions saved yet.</p>
                <p className="text-tertiary text-xs mt-1">RSVP to the top pick above to start building your agenda.</p>
              </div>
            )}
          </section>
        </div>

        {/* Matches column */}
        <div className="dashboard-col-matches">
          <section>
            <div className="section-header mb-3">
              <h2 className="section-title">
                <Users size={18} style={{ color: 'var(--accent-secondary)' }} />
                Top Networking Matches
              </h2>
              <span className="text-xs text-tertiary">AI-ranked · goal alignment</span>
            </div>
            <div className="flex flex-col gap-3">
              {topMatches.length > 0 ? topMatches.map((match, idx) => (
                <div key={match.id} style={{ animationDelay: `${idx * 60}ms` }} className="animate-fade-in">
                  <MatchCard match={match} />
                </div>
              )) : (
                <div className="empty-state-sm card text-center">
                  <Users size={24} className="text-tertiary mx-auto mb-2" />
                  <p className="text-secondary text-sm">No matches yet — update your profile interests to improve recommendations.</p>
                </div>
              )}
            </div>
          </section>

          {/* New Live Feed Section */}
          <section className="mt-6">
            <EventFeed />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

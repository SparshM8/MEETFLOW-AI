import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Briefcase, Zap, Loader2 } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { getMatchScore } from '../utils/matchmaking';
import { generateIcebreaker, generateReasonToConnect } from '../services/aiService';
import './MatchDetails.css';

const MatchDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, attendees } = useContext(AppContext);
  
  const [match, setMatch] = useState(null);
  const [icebreaker, setIcebreaker] = useState('');
  const [reason, setReason] = useState('');
  const [loadingAI, setLoadingAI] = useState(true);

  useEffect(() => {
    if (!currentUser || !attendees) return;
    
    const person = attendees.find(a => a.id === id);
    if (person) {
      const details = getMatchScore(currentUser, person);
      const matchData = { ...person, matchDetails: details, score: details.score };
      setMatch(matchData);
      
      // trigger mock AI generation
      const fetchAI = async () => {
        setLoadingAI(true);
        const [genReason, genIcebreaker] = await Promise.all([
          generateReasonToConnect(currentUser, person, details),
          generateIcebreaker(currentUser, person, details)
        ]);
        setReason(genReason);
        setIcebreaker(genIcebreaker);
        setLoadingAI(false);
      };
      fetchAI();
    }
  }, [id, currentUser, attendees]);

  if (!match) return <div className="flex-center" style={{height:'100vh'}}><Loader2 className="animate-spin" /></div>;

  return (
    <div className="match-details-page animate-fade-in">
      <button className="btn btn-secondary back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="profile-hero glass-panel">
        <div className="profile-header">
          <div className="profile-avatar">
            <span>{match.name.charAt(0)}</span>
          </div>
          <div className="profile-title">
            <h1>{match.name}</h1>
            <p className="role"><Briefcase size={16}/> {match.role} @ {match.company}</p>
          </div>
        </div>
        <div className="match-score-pill">
          <Zap size={16} className="text-warning"/> {Math.round(match.score)} Match Score
        </div>
        
        <p className="bio">{match.bio}</p>
      </div>

      <div className="ai-insights grid-cols-2 mt-8">
        <div className="insight-card card animate-slide-down" style={{animationDelay: '100ms'}}>
          <h3 className="insight-title"><SparklesIcon /> AI Reason to Connect</h3>
          {loadingAI ? (
            <div className="loading-state"><Loader2 className="animate-spin" size={24} /> Generating...</div>
          ) : (
            <p className="insight-text">{reason}</p>
          )}
        </div>

        <div className="insight-card card animate-slide-down" style={{animationDelay: '200ms'}}>
          <h3 className="insight-title"><MessageSquare size={18} className="text-primary"/> Suggested Icebreaker</h3>
          {loadingAI ? (
            <div className="loading-state"><Loader2 className="animate-spin" size={24} /> Crafting message...</div>
          ) : (
            <div className="icebreaker-box">
              <p className="insight-text">"{icebreaker}"</p>
              <button className="btn btn-primary btn-sm mt-3 w-full">Copy Message</button>
            </div>
          )}
        </div>
      </div>

      <div className="shared-attributes grid-cols-2 mt-8">
        <div className="attr-section">
          <h3>Shared Interests</h3>
          <div className="pill-group mt-3">
            {match.matchDetails.sharedInterests.map(i => <span key={i} className="badge badge-ai">{i}</span>)}
            {match.matchDetails.sharedInterests.length === 0 && <span className="text-secondary">None discovered yet.</span>}
          </div>
        </div>
        <div className="attr-section">
          <h3>Skills</h3>
          <div className="pill-group mt-3">
            {match.skills.map(s => (
              <span key={s} className={`badge ${match.matchDetails.sharedSkills.includes(s) ? 'badge-success' : 'badge-outline'}`}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SparklesIcon = () => <Zap size={18} className="text-secondary" />; // Fallback since I forgot Sparkles import

export default MatchDetails;

import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { X, Clock, MapPin, Tag, UserRound, CheckCircle2, AlertCircle, Sparkles, Building2, ChevronDown, ChevronUp, Target, Users, NotebookPen } from 'lucide-react';
import './SessionDrawer.css';

const SessionDrawer = ({ sessionId, onClose }) => {
  const { sessions, userAgenda, waitlist, rsvpToSession, removeFromAgenda, currentUser, getSessionNote, saveSessionNote } = useContext(AppContext);
  const [session, setSession] = useState(null);
  const [showWhyPanel, setShowWhyPanel] = useState(false);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    if (sessionId) {
      const s = sessions.find(s => s.id === sessionId);
      setSession(s);
      if (s) setNoteText(getSessionNote(s.id));
    }
  }, [sessionId, sessions]);

  // Handle escape key to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!session) return null;

  const isRSVPd = userAgenda.some(s => s.id === session.id);
  const isWaitlisted = waitlist.some(s => s.id === session.id);

  return (
    <>
      <div className="drawer-overlay animate-fade-in" onClick={onClose}></div>
      <div className="session-drawer animate-slide-left">
        <div className="drawer-header flex-between border-b pb-4">
          <div className="flex items-center gap-3">
             <div className="badge badge-ai">{session.type || 'Session'}</div>
             {session.status === 'Full' && <span className="badge badge-danger">Capacity Reached</span>}
             {session.status === 'Filling Fast' && <span className="badge badge-warning">Filling Fast</span>}
          </div>
          <button className="drawer-close" onClick={onClose}><X size={20}/></button>
        </div>

        <div className="drawer-content">
          <h1 className="text-xl text-primary font-semibold mt-4 line-clamp-2">{session.title}</h1>
          
          <div className="drawer-meta mt-4 flex gap-6 text-sm text-secondary">
            <div className="flex items-center gap-1"><Clock size={16} className="text-accent-primary"/> <span>{session.time} ({session.duration})</span></div>
            <div className="flex items-center gap-1"><MapPin size={16} className="text-accent-primary"/> <span>{session.location}</span></div>
          </div>

          <div className="drawer-section mt-8">
            <h3 className="section-title">About this Session</h3>
            <p className="mt-2 text-secondary leading-relaxed">{session.description}</p>
          </div>

          {session.learningOutcomes?.length > 0 && (
             <div className="drawer-section mt-6">
                <h3 className="section-title text-sm text-primary mb-2">What You'll Learn</h3>
                <ul className="learning-list">
                   {session.learningOutcomes.map((l, i) => <li key={i}><CheckCircle2 size={14} className="text-success mt-1"/> <span className="text-secondary text-sm">{l}</span></li>)}
                </ul>
             </div>
          )}

          <div className="drawer-section mt-8 card p-4">
            <h3 className="section-title text-sm mb-3 text-secondary">Speaker Details</h3>
            <div className="flex items-start gap-4">
              <div className="avatar-lg bg-gradient flex-center text-white" style={{width: 48, height: 48, fontSize: '1.2rem'}}>
                 {session.speaker ? session.speaker.charAt(0) : <UserRound size={20} />}
              </div>
              <div className="flex-1">
                 <h4 className="text-primary font-medium">{session.speaker || 'TBA'}</h4>
                 <p className="text-xs text-secondary mt-1">{session.speakerRole}</p>
                 <p className="text-xs text-tertiary flex items-center gap-1 mt-1"><Building2 size={12}/> {session.speakerCompany}</p>
                 {session.speakerBio && <p className="text-sm mt-3 text-secondary border-t border-glass pt-2">{session.speakerBio}</p>}
              </div>
            </div>
          </div>

          {session.whyRecommended && (
            <div className="drawer-section mt-6">
              <button
                className="why-session-toggle"
                onClick={() => setShowWhyPanel(v => !v)}
              >
                <Sparkles size={13} />
                <span>Why this session for you?</span>
                {showWhyPanel ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>

              {showWhyPanel && (
                <div className="why-session-panel animate-fade-in">
                  <p className="why-session-reason">{session.whyRecommended}</p>
                  <div className="why-session-signals">
                    {currentUser?.interests?.some(i => session.tags.some(t => t.toLowerCase().includes(i.toLowerCase()))) && (
                      <div className="why-signal-chip">
                        <Sparkles size={10} /> Matches your interests
                      </div>
                    )}
                    {session.intendedAudience && (
                      <div className="why-signal-chip">
                        <Users size={10} /> {session.intendedAudience}
                      </div>
                    )}
                    {currentUser?.goals?.length > 0 && (
                      <div className="why-signal-chip">
                        <Target size={10} /> Aligns with your event goals
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="drawer-section mt-6 mb-4">
            <h4 className="flex items-center gap-2 text-sm text-secondary mb-2">
              <NotebookPen size={14} /> Quick Notes
            </h4>
            <textarea
              className="notes-textarea"
              placeholder="Jot down anything about this session — questions to ask, key takeaways, action items…"
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              rows={3}
            />
            <button
              className="btn btn-secondary btn-sm mt-2"
              style={{ fontSize: '0.75rem' }}
              onClick={() => saveSessionNote(session.id, noteText)}
            >
              Save Note
            </button>
            {getSessionNote(session.id) && (
              <p className="text-xs text-tertiary mt-1">
                ✓ Note saved — persists across sessions.
              </p>
            )}
          </div>

          <div className="drawer-section mt-4 mb-20">
             <h4 className="text-sm text-secondary mb-2">Tags</h4>
             <div className="pill-group">
                {session.tags.map(tag => <span key={tag} className="badge badge-outline">{tag}</span>)}
             </div>
          </div>
        </div>

        <div className="drawer-footer pt-4 border-t border-glass">
            {isRSVPd ? (
              <div className="flex gap-4 items-center">
                 <div className="flex items-center gap-2 text-success font-medium flex-1"><CheckCircle2 size={20}/> RSVP Confirmed</div>
                 <button className="btn btn-outline" onClick={() => removeFromAgenda(session.id)}>Unsave</button>
              </div>
            ) : isWaitlisted ? (
              <div className="flex gap-4 items-center">
                 <div className="flex items-center gap-2 text-warning font-medium flex-1"><AlertCircle size={20}/> On Waitlist</div>
                 <button className="btn btn-outline" onClick={() => removeFromAgenda(session.id)}>Leave Waitlist</button>
              </div>
            ) : (
              <button 
                className={`btn btn-primary w-full ${session.status === 'Full' ? 'btn-waitlist' : ''}`}
                onClick={() => rsvpToSession(session)}
              >
                {session.status === 'Full' ? 'Join Waitlist' : 'RSVP to Session'}
              </button>
            )}
        </div>
      </div>
    </>
  );
};

export default SessionDrawer;

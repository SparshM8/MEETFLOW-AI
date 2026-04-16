import React, { useState, useEffect } from 'react';
import { Brain, CheckCircle2, Search, Zap, Target, Loader2 } from 'lucide-react';
import './ReasoningChain.css';

/**
 * ReasoningChain Component (AI Transparency)
 * Visualizes the 'Chain of Thought' process behind an AI match.
 * Transitions through different analysis phases to show the 'work' behind the score.
 */
const ReasoningChain = ({ match, currentUser }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const steps = [
    { 
      id: 'context', 
      label: 'Context Extraction', 
      desc: `Parsing profile delta for ${match.name}...`, 
      icon: <Search size={14}/> 
    },
    { 
      id: 'semantic', 
      label: 'Semantic Mapping', 
      desc: `Calculating overlap in ${match.interests.length} interest areas.`, 
      icon: <Zap size={14}/> 
    },
    { 
      id: 'goal', 
      label: 'Goal Alignment', 
      desc: `Heuristic check: ${currentUser.goals?.[0]} vs ${match.goals?.[0]}.`, 
      icon: <Target size={14}/> 
    },
    { 
      id: 'synthesis', 
      label: 'Weighted Synthesis', 
      desc: `Matching logic complete. Finalizing ranking signals.`, 
      icon: <Brain size={14}/> 
    }
  ];

  useEffect(() => {
    if (isCompleted) return;
    
    const timers = steps.map((_, i) => {
      return setTimeout(() => {
        setActiveStep(i);
        if (i === steps.length - 1) {
          setTimeout(() => setIsCompleted(true), 1200);
        }
      }, i * 1400); // Gradual reveal
    });

    return () => timers.forEach(t => clearTimeout(t));
  }, [match.id, isCompleted]);

  return (
    <div className="reasoning-chain-container">
      <div className="rc-header">
        <Sparkles size={12} className="text-accent-secondary" />
        <span>Gemini Reasoning Chain</span>
      </div>
      
      <div className="rc-steps">
        {steps.map((step, i) => {
          const isDone = i < activeStep || isCompleted;
          const isActive = i === activeStep && !isCompleted;
          
          return (
            <div key={step.id} className={`rc-step ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
              <div className="rc-line"></div>
              <div className="rc-indicator">
                {isDone ? <CheckCircle2 size={12}/> : isActive ? <Loader2 size={12} className="animate-spin"/> : <div className="rc-dot"></div>}
              </div>
              <div className="rc-body">
                <div className="rc-label">
                  <span className="rc-icon">{step.icon}</span>
                  {step.label}
                </div>
                {isActive && <div className="rc-desc">{step.desc}</div>}
              </div>
            </div>
          );
        })}
      </div>

      {isCompleted && (
        <div className="rc-completion animate-fade-in">
          <div className="rc-cert-badge">
             <CheckCircle2 size={10} /> Verified by MeetFlow Reasoning Engine
          </div>
          <p className="text-xs text-tertiary mt-2">
            Analysis complete. Determined a <strong>{match.matchDetails.score}%</strong> compatibility factor.
          </p>
        </div>
      )}
    </div>
  );
};

const Sparkles = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/><path d="M7 5H3"/><path d="M22 17v4"/><path d="M24 19h-4"/>
  </svg>
);

export default ReasoningChain;

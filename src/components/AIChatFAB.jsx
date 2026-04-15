import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, Bot, User } from 'lucide-react';
import './AIChatFAB.css';

const AIChatFAB = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hi! I'm your AI Concierge. Ask me anything about the event schedule, people to meet, or things to do." }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInputValue('');
    setIsTyping(true);

    // Mock AI Response based on keywords
    setTimeout(() => {
      let aiResponse = "I can definitely help with that. Are you looking to find more sessions on this topic, or people to connect with?";
      
      const lower = userMessage.toLowerCase();
      if (lower.includes('gen ai') || lower.includes('generative ai')) {
        aiResponse = "There's a great panel on 'The Future of Generative AI' starting soon at the Main Stage. Would you like me to RSVP for you or show you who else is attending?";
      } else if (lower.includes('lunch') || lower.includes('food')) {
        aiResponse = "Lunch is from 12:00 PM to 1:00 PM in the Dining Hall. It's a great chance to find a co-founder!";
      } else if (lower.includes('waitlist') || lower.includes('full')) {
        aiResponse = "If a session is full, I automatically scan the schedule for alternatives. You can leave the waitlist anytime from your Agenda.";
      }

      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      <button 
        className={`ai-fab-button ${isOpen ? 'hidden' : 'animate-bounce-in'}`}
        onClick={() => setIsOpen(true)}
      >
        <Sparkles size={24} className="text-white" />
      </button>

      {isOpen && (
        <div className="ai-chat-drawer animate-slide-up">
          <div className="ai-chat-header">
            <div className="flex items-center gap-2">
              <div className="ai-avatar-small"><Sparkles size={14} /></div>
              <h3 className="text-sm font-semibold text-white">Event Concierge</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-tertiary hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="ai-chat-body">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.role === 'ai' ? 'chat-ai' : 'chat-user'}`}>
                {msg.role === 'ai' && <div className="chat-msg-icon bg-accent-glow"><Bot size={12} /></div>}
                <div className="chat-bubble">{msg.text}</div>
                {msg.role === 'user' && <div className="chat-msg-icon bg-glass"><User size={12} /></div>}
              </div>
            ))}
            {isTyping && (
              <div className="chat-message chat-ai">
                <div className="chat-msg-icon bg-accent-glow"><Bot size={12} /></div>
                <div className="chat-bubble typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="ai-chat-footer" onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Ask me about the event..." 
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              className="ai-chat-input"
            />
            <button type="submit" disabled={!inputValue.trim()} className="ai-chat-send">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AIChatFAB;

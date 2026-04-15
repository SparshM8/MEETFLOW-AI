import React, { useState, useEffect } from 'react';
import { Bell, UserPlus, Coffee, Zap } from 'lucide-react';
import './EventFeed.css';

const FEED_TEMPLATES = [
  { id: 1, type: 'join', icon: <UserPlus />, text: 'Just joined the networking graph!' },
  { id: 2, type: 'amenity', icon: <Coffee />, text: 'New catering station opened in the Lounge.' },
  { id: 3, type: 'session', icon: <Zap />, text: 'Session starting soon: "The Future of GenAI".' },
  { id: 4, type: 'match', icon: <Bell />, text: 'A new high-value match just entered the lobby.' }
];

const NAMES = ['Alex', 'Sarah', 'Prateek', 'Elena', 'Jordan', 'Maya'];

const EventFeed = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Initial load
    const initial = Array(3).fill(null).map((_, i) => createItem(i));
    setItems(initial);

    // Interval to add new "Live" events
    const interval = setInterval(() => {
      setItems(prev => [createItem(Date.now()), ...prev].slice(0, 5));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  function createItem(id) {
    const template = FEED_TEMPLATES[Math.floor(Math.random() * FEED_TEMPLATES.length)];
    const name = NAMES[Math.floor(Math.random() * NAMES.length)];
    return {
      id,
      ...template,
      timestamp: 'Just now',
      name: template.type === 'amenity' ? 'Event Staff' : name
    };
  }

  return (
    <div className="event-feed card">
      <div className="feed-header">
        <h3 className="flex-center gap-2">
          <Bell size={18} className="text-accent" />
          Live Event Pulse
        </h3>
        <span className="live-badge">LIVE</span>
      </div>
      
      <div className="feed-list">
        {items.map(item => (
          <div key={item.id} className="feed-item animate-fade-in">
            <div className={`feed-icon icon-${item.type}`}>
              {item.icon}
            </div>
            <div className="feed-content">
              <p className="feed-text">
                <span className="feed-name">{item.name}</span> {item.text}
              </p>
              <span className="feed-time">{item.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventFeed;

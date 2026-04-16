import React from 'react';
import { MapPin, Navigation, Info } from 'lucide-react';
import './VenueMap.css';

const VenueMap = ({ location = "Moscone Center, San Francisco" }) => {
  // Mock Google Maps Embed URL (requires API Key for real usage)
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY_HERE&q=${encodeURIComponent(location)}`;

  return (
    <div className="venue-map-container card border-glass">
      <div className="map-header">
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-secondary" />
          <h3 className="section-title">Interactive Venue Pulse</h3>
        </div>
        <div className="map-status-pill">
          <div className="pulse-dot-green"></div>
          <span className="text-[10px] font-bold">LIVE FLOOR PLAN</span>
        </div>
      </div>

      <div className="map-wrapper mt-4">
        {/* Elite SVG Floor Plan Fallback */}
        <div className="floor-plan-svg-container">
          <svg viewBox="0 0 800 500" className="floor-plan-svg" aria-label="Venue Floor Plan">
            {/* Outer Walls */}
            <rect x="50" y="50" width="700" height="400" rx="20" className="svg-bg" />
            
            {/* Rooms */}
            <rect x="80" y="80" width="200" height="150" rx="10" className="svg-room" />
            <text x="110" y="160" className="svg-label">Main Stage</text>
            
            <rect x="300" y="80" width="180" height="120" rx="10" className="svg-room active" />
            <text x="320" y="145" className="svg-label">Innovation Hub</text>
            
            <rect x="500" y="80" width="220" height="180" rx="10" className="svg-room" />
            <text x="560" y="175" className="svg-label">Expo Hall</text>

            <rect x="80" y="270" width="300" height="150" rx="10" className="svg-room" />
            <text x="140" y="350" className="svg-label">Networking Lounge</text>
            
            <rect x="400" y="270" width="320" height="150" rx="10" className="svg-room" />
            <text x="480" y="350" className="svg-label">Workshop Room C</text>

            {/* Pathfinding Connection (Simulated) */}
            <path d="M 400 140 Q 400 220 200 320" className="svg-path animate-dash" />
            
            {/* User Indicator */}
            <circle cx="400" cy="140" r="8" className="svg-user-dot" />
            <circle cx="400" cy="140" r="16" className="svg-user-ring animate-ping-slow" />
            
            {/* Next Milestone */}
            <g transform="translate(190, 310)">
              <circle r="6" className="svg-dest-dot" />
              <text y="-15" x="-40" className="svg-dest-label">NEXT: Networking Meetup</text>
            </g>
          </svg>
        </div>
        
        <div className="map-legend">
          <div className="legend-item"><div className="dot dot-user"></div> <span>You (Innovation Hub)</span></div>
          <div className="legend-item"><div className="dot dot-dest"></div> <span>Target Location</span></div>
        </div>
      </div>

      <div className="venue-details mt-4">
        <p className="text-sm font-semibold">{location}</p>
        <p className="text-xs text-secondary mt-1">Main Hall · Innovation District, Level 2</p>
      </div>
    </div>
  );
};

export default VenueMap;

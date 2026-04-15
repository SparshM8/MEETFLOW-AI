import React from 'react';
import { MapPin, Navigation, Info } from 'lucide-react';
import './VenueMap.css';

const VenueMap = ({ location = "Moscone Center, San Francisco" }) => {
  // Mock Google Maps Embed URL (requires API Key for real usage)
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY_HERE&q=${encodeURIComponent(location)}`;

  return (
    <div className="venue-map-container card">
      <div className="map-header">
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-accent-primary" />
          <h3 className="section-title">Venue Location</h3>
        </div>
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sm btn-outline"
        >
          <Navigation size={14} /> Open in Maps
        </a>
      </div>

      <div className="map-wrapper">
        <iframe
          title="Venue Map"
          width="100%"
          height="100%"
          style={{ border: 0, borderRadius: 'var(--radius-md)' }}
          loading="lazy"
          allowFullScreen
          src={mapUrl}
        ></iframe>
        
        {/* Overlay for "Key Required" explanation if using a placeholder */}
        <div className="map-overlay">
          <div className="overlay-content">
            <Info size={32} className="mb-2 text-accent-secondary" />
            <p className="text-sm font-medium">Google Maps Integration Initialized</p>
            <p className="text-xs text-secondary mt-1 max-width-200">
              To activate the real-time map, add your Google Maps API Key to the VITE_GMAPS_KEY environment variable.
            </p>
          </div>
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

'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const JobLocationMap = ({ location, address }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Skip if no map container or location
    if (!mapRef.current || !location) return;

    // Function to geocode location to coordinates
    const geocodeLocation = async () => {
      try {
        setLoading(true);
        // Using OpenStreetMap Nominatim API for geocoding (free)
        const searchQuery = `${location}, Sri Lanka`;
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
        );
        const data = await response.json();

        let lat = 7.8731; // Default Sri Lanka center (Kandy area)
        let lng = 80.7718;
        let locationName = location;

        if (data && data.length > 0) {
          lat = parseFloat(data[0].lat);
          lng = parseFloat(data[0].lon);
          locationName = data[0].display_name.split(',')[0];
        }

        // Initialize map if not already initialized
        if (!mapInstanceRef.current) {
          mapInstanceRef.current = L.map(mapRef.current).setView([lat, lng], 13);

          // Add tile layer (OpenStreetMap)
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
          }).addTo(mapInstanceRef.current);

          // Add marker
          const marker = L.marker([lat, lng]).addTo(mapInstanceRef.current);
          
          // Add popup with location info
          marker.bindPopup(`
            <strong>${address || locationName}</strong><br/>
            ${location}, Sri Lanka
          `).openPopup();
        } else {
          // Update map view if already initialized
          mapInstanceRef.current.setView([lat, lng], 13);
          
          // Clear existing markers
          mapInstanceRef.current.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
              mapInstanceRef.current.removeLayer(layer);
            }
          });
          
          // Add new marker
          const marker = L.marker([lat, lng]).addTo(mapInstanceRef.current);
          marker.bindPopup(`
            <strong>${address || locationName}</strong><br/>
            ${location}, Sri Lanka
          `).openPopup();
        }
        setError(null);
      } catch (error) {
        console.error('Error geocoding location:', error);
        setError('Unable to load map for this location');
        
        // Show default Sri Lanka view
        if (!mapInstanceRef.current) {
          mapInstanceRef.current = L.map(mapRef.current).setView([7.8731, 80.7718], 8);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(mapInstanceRef.current);
        }
      } finally {
        setLoading(false);
      }
    };

    geocodeLocation();

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [location, address]);

  if (!location) {
    return (
      <div style={styles.placeholder}>
        <p>No location specified</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {loading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.spinner}></div>
          <p>Loading map...</p>
        </div>
      )}
      {error && (
        <div style={styles.errorOverlay}>
          <p>{error}</p>
        </div>
      )}
      <div ref={mapRef} style={styles.map} />
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#f1f5f9',
  },
  map: {
    width: '100%',
    height: '100%',
    minHeight: 220,
  },
  placeholder: {
    height: 220,
    background: '#f1f5f9',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#94a3b8',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255,255,255,0.9)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    gap: 8,
  },
  spinner: {
    width: 30,
    height: 30,
    border: '3px solid #e2e8f0',
    borderTopColor: '#1d4ed8',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(254, 242, 242, 0.95)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    color: '#dc2626',
    fontSize: 12,
    textAlign: 'center',
    padding: 16,
  },
};

// Add keyframes animation
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default JobLocationMap;
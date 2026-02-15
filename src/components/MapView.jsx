import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';
import './MapView.css';

const MapView = ({ apartments, center, onSelectApartment }) => {
  const [activeMarker, setActiveMarker] = useState(null);

  const mapContainerStyle = {
    width: '100%',
    height: '500px',
    borderRadius: '8px'
  };

  const defaultCenter = center || { lat: 40.7128, lng: -74.0060 }; // NYC default

  // Get API key from environment variable
  // No fallback - fail explicitly if not configured
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
    return (
      <div className="map-view">
        <div style={{ padding: '2rem', textAlign: 'center', background: '#fff3cd', borderRadius: '8px' }}>
          <h3>⚠️ Google Maps API Key Required</h3>
          <p>Please configure your Google Maps API key in the .env file to use the map view.</p>
          <p>See the README for instructions on obtaining an API key.</p>
        </div>
      </div>
    );
  }

  const handleMarkerClick = (apartment) => {
    setActiveMarker(apartment.id);
    onSelectApartment(apartment);
  };

  return (
    <div className="map-view">
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={defaultCenter}
          zoom={12}
        >
          {apartments.map((apartment) => (
            <Marker
              key={apartment.id}
              position={{ lat: apartment.latitude, lng: apartment.longitude }}
              onClick={() => handleMarkerClick(apartment)}
              icon={{
                url: activeMarker === apartment.id 
                  ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
                  : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
              }}
            />
          ))}

          {activeMarker && (
            <InfoWindow
              position={{
                lat: apartments.find(a => a.id === activeMarker)?.latitude,
                lng: apartments.find(a => a.id === activeMarker)?.longitude
              }}
              onCloseClick={() => setActiveMarker(null)}
            >
              <div className="info-window">
                <h3>{apartments.find(a => a.id === activeMarker)?.name}</h3>
                <p>${apartments.find(a => a.id === activeMarker)?.price}/mo</p>
                <p>{apartments.find(a => a.id === activeMarker)?.address}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapView;

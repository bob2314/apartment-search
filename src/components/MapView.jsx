import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useMemo, useState } from 'react';
import { isLikelyGoogleApiKey } from '../utils/mockData';
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

  const activeApartment = useMemo(
    () => apartments.find((apartment) => apartment.id === activeMarker),
    [activeMarker, apartments]
  );

  if (!isLikelyGoogleApiKey(apiKey)) {
    return (
      <div className="map-view">
        <div style={{ padding: '2rem', textAlign: 'center', background: '#fff3cd', borderRadius: '8px' }}>
          <h3>⚠️ Google Maps API Key Required</h3>
          <p>Please set a valid `VITE_GOOGLE_MAPS_API_KEY` in `.env` to use map mode.</p>
          <p>The key should look like `AIza...` and include Maps JavaScript API + Geocoding API access.</p>
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

          {activeApartment && (
            <InfoWindow
              position={{
                lat: activeApartment.latitude,
                lng: activeApartment.longitude
              }}
              onCloseClick={() => setActiveMarker(null)}
            >
              <div className="info-window">
                <h3>{activeApartment.name}</h3>
                <p>${activeApartment.price}/mo</p>
                <p>{activeApartment.address}</p>
                <p>{activeApartment.source}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapView;

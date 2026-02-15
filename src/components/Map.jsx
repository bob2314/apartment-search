import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';
import { formatDistance } from '../utils/distance';
import './Map.css';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const mapContainerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '8px'
};

const defaultCenter = {
  lat: 40.7506,
  lng: -73.9971
};

const Map = ({ center, listings, selectedListing, onMarkerClick }) => {
  const [infoWindowListing, setInfoWindowListing] = useState(null);
  
  const mapCenter = center || defaultCenter;
  
  const handleMarkerClick = (listing) => {
    setInfoWindowListing(listing);
    if (onMarkerClick) {
      onMarkerClick(listing);
    }
  };
  
  // If no API key, show a placeholder
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="map-placeholder">
        <div className="map-placeholder-content">
          <h3>🗺️ Map View</h3>
          <p>Add VITE_GOOGLE_MAPS_API_KEY to .env file to enable Google Maps</p>
          <div className="map-info">
            <p><strong>Search Center:</strong> {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}</p>
            <p><strong>Listings:</strong> {listings?.length || 0} apartments found</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="map-container">
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={12}
        >
          {/* Search center marker */}
          <Marker
            position={mapCenter}
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            }}
          />
          
          {/* Listing markers */}
          {listings && listings.map(listing => (
            <Marker
              key={listing.id}
              position={{ lat: listing.lat, lng: listing.lng }}
              onClick={() => handleMarkerClick(listing)}
              icon={{
                url: selectedListing?.id === listing.id
                  ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                  : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
              }}
            />
          ))}
          
          {/* Info Window */}
          {infoWindowListing && (
            <InfoWindow
              position={{ lat: infoWindowListing.lat, lng: infoWindowListing.lng }}
              onCloseClick={() => setInfoWindowListing(null)}
            >
              <div className="info-window">
                <h4>{infoWindowListing.title}</h4>
                <p className="info-price">${infoWindowListing.price}/mo</p>
                <p className="info-address">{infoWindowListing.address}</p>
                <p className="info-details">
                  {infoWindowListing.bedrooms} bed • {infoWindowListing.bathrooms} bath
                </p>
                <p className="info-distance">
                  {formatDistance(infoWindowListing.distance)} away
                </p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Map;

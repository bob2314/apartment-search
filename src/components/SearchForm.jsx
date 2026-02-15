import { useState } from 'react';
import './SearchForm.css';

// Feature display names mapping
const FEATURE_LABELS = {
  parking: 'Parking',
  gym: 'Gym',
  pool: 'Pool',
  petFriendly: 'Pet Friendly',
  laundry: 'Laundry',
  airConditioning: 'Air Conditioning',
  dishwasher: 'Dishwasher',
  balcony: 'Balcony'
};

const LISTING_SOURCES = {
  apartmentsCom: 'Apartments.com',
  googleMaps: 'Google Maps',
  zillow: 'Zillow',
  realtor: 'Realtor.com'
};

const SearchForm = ({ onSearch, isLoading }) => {
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState('10');
  const [features, setFeatures] = useState({
    parking: false,
    gym: false,
    pool: false,
    petFriendly: false,
    laundry: false,
    airConditioning: false,
    dishwasher: false,
    balcony: false
  });
  const [sources, setSources] = useState({
    apartmentsCom: true,
    googleMaps: true,
    zillow: true,
    realtor: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedFeatures = Object.keys(features).filter(key => features[key]);
    const selectedSources = Object.keys(sources).filter(key => sources[key]);

    if (selectedSources.length === 0) {
      return;
    }

    onSearch({
      location,
      radius: parseInt(radius),
      features: selectedFeatures,
      sources: selectedSources
    });
  };

  const handleFeatureChange = (feature) => {
    setFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };

  const handleSourceChange = (source) => {
    setSources(prev => ({
      ...prev,
      [source]: !prev[source]
    }));
  };

  const selectedSourceCount = Object.values(sources).filter(Boolean).length;

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="form-group">
        <label htmlFor="location">Location (City, State, or Zip Code)</label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g., New York, NY or 10001"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="radius">Search Radius (miles)</label>
        <select
          id="radius"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
        >
          <option value="5">5 miles</option>
          <option value="10">10 miles</option>
          <option value="15">15 miles</option>
          <option value="20">20 miles</option>
          <option value="25">25 miles</option>
          <option value="50">50 miles</option>
        </select>
      </div>

      <div className="form-group features">
        <label>Apartment Features</label>
        <div className="checkbox-grid">
          {Object.keys(features).map(feature => (
            <label key={feature} className="checkbox-label">
              <input
                type="checkbox"
                checked={features[feature]}
                onChange={() => handleFeatureChange(feature)}
              />
              <span>{FEATURE_LABELS[feature]}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-group features">
        <label>Listing Sources</label>
        <div className="checkbox-grid">
          {Object.keys(sources).map(source => (
            <label key={source} className="checkbox-label">
              <input
                type="checkbox"
                checked={sources[source]}
                onChange={() => handleSourceChange(source)}
              />
              <span>{LISTING_SOURCES[source]}</span>
            </label>
          ))}
        </div>
        {selectedSourceCount === 0 && (
          <p className="input-hint error">Select at least one source.</p>
        )}
      </div>

      <button type="submit" disabled={isLoading} className="search-button">
        {isLoading ? 'Searching...' : 'Search Apartments'}
      </button>
    </form>
  );
};

export default SearchForm;

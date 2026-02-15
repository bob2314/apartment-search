import { useState } from 'react';
import { getAvailableAmenities } from '../services/listingAggregator';
import './SearchForm.css';

const SearchForm = ({ onSearch, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [radius, setRadius] = useState(10);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minBedrooms, setMinBedrooms] = useState('');
  
  const amenities = getAvailableAmenities();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      alert('Please enter a city, state, or zipcode');
      return;
    }
    
    onSearch({
      location: searchTerm.trim(),
      radius: parseInt(radius),
      filters: {
        amenities: selectedAmenities,
        minPrice: minPrice ? parseInt(minPrice) : undefined,
        maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
        minBedrooms: minBedrooms ? parseInt(minBedrooms) : undefined
      }
    });
  };
  
  const handleAmenityToggle = (amenity) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };
  
  return (
    <div className="search-form">
      <form onSubmit={handleSubmit}>
        <div className="search-header">
          <h1>Apartment Search</h1>
          <p>Find your perfect apartment with advanced search filters</p>
        </div>
        
        <div className="form-group">
          <label htmlFor="location">City, State, or Zipcode</label>
          <input
            type="text"
            id="location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="e.g., New York, 10001, Austin TX"
            disabled={isLoading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="radius">Search Radius: {radius} miles</label>
          <input
            type="range"
            id="radius"
            min="1"
            max="50"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <div className="filters-section">
          <h3>Filters</h3>
          
          <div className="filter-row">
            <div className="form-group">
              <label htmlFor="minPrice">Min Price ($)</label>
              <input
                type="number"
                id="minPrice"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="500"
                min="0"
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="maxPrice">Max Price ($)</label>
              <input
                type="number"
                id="maxPrice"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="5000"
                min="0"
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="minBedrooms">Min Bedrooms</label>
              <input
                type="number"
                id="minBedrooms"
                value={minBedrooms}
                onChange={(e) => setMinBedrooms(e.target.value)}
                placeholder="1"
                min="0"
                max="10"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="amenities-section">
            <h4>Amenities</h4>
            <div className="amenities-grid">
              {amenities.map(amenity => (
                <label key={amenity} className="amenity-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    disabled={isLoading}
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <button type="submit" className="search-button" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search Apartments'}
        </button>
      </form>
    </div>
  );
};

export default SearchForm;

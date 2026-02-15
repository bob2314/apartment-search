import { useState } from 'react';
import SearchForm from '../components/SearchForm';
import ApartmentList from '../components/ApartmentList';
import MapView from '../components/MapView';
import { generateMockApartments, geocodeLocation } from '../utils/mockData';
import useApartmentCache from '../hooks/useApartmentCache';
import './SearchPage.css';

const SearchPage = () => {
  const [apartments, setApartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

  const { getCachedResults, setCachedResults } = useApartmentCache();

  const handleSearch = async (searchParams) => {
    setIsLoading(true);
    setHasSearched(true);

    // Check cache first
    const cachedResults = getCachedResults(searchParams);
    if (cachedResults) {
      console.log('Using cached results');
      setApartments(cachedResults.apartments);
      setMapCenter(cachedResults.center);
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Geocode the location
      const coordinates = await geocodeLocation(searchParams.location);
      setMapCenter(coordinates);

      // Fetch apartments (mock data)
      // In production, this would call multiple listing APIs
      const results = generateMockApartments(
        searchParams.location,
        searchParams.radius,
        searchParams.features
      );

      setApartments(results);

      // Cache the results
      setCachedResults(searchParams, {
        apartments: results,
        center: coordinates
      });
    } catch (error) {
      console.error('Error searching apartments:', error);
      setApartments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectApartment = (apartment) => {
    setSelectedApartment(apartment);
    // Scroll to top to see map if in list view
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="search-page">
      <header className="page-header">
        <h1>🏠 Apartment Search</h1>
        <p>Find your perfect apartment with our comprehensive search tool</p>
      </header>

      <div className="search-container">
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />

        {hasSearched && (
          <>
            <div className="view-toggle">
              <button
                className={viewMode === 'list' ? 'active' : ''}
                onClick={() => setViewMode('list')}
              >
                📋 List View
              </button>
              <button
                className={viewMode === 'map' ? 'active' : ''}
                onClick={() => setViewMode('map')}
              >
                🗺️ Map View
              </button>
            </div>

            {viewMode === 'map' && apartments.length > 0 && (
              <MapView
                apartments={apartments}
                center={mapCenter}
                selectedApartment={selectedApartment}
                onSelectApartment={handleSelectApartment}
              />
            )}

            {viewMode === 'list' && (
              <ApartmentList
                apartments={apartments}
                onSelectApartment={handleSelectApartment}
              />
            )}
          </>
        )}

        {!hasSearched && (
          <div className="welcome-message">
            <h2>Welcome to Apartment Search! 🎉</h2>
            <p>Enter your desired location, search radius, and preferred amenities to find your perfect apartment.</p>
            <ul>
              <li>🔍 Search by city, state, or zip code</li>
              <li>📍 Customize your search radius</li>
              <li>✅ Filter by desired apartment features</li>
              <li>🗺️ View results on an interactive map</li>
              <li>📊 Sort listings by distance</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;

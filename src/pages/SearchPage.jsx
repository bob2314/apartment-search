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
  const [errorMessage, setErrorMessage] = useState('');
  const [lastSearch, setLastSearch] = useState(null);

  const { getCachedResults, setCachedResults } = useApartmentCache();

  const handleSearch = async (searchParams) => {
    setIsLoading(true);
    setHasSearched(true);
    setErrorMessage('');

    const normalizedSearch = {
      ...searchParams,
      location: searchParams.location.trim().replace(/\s+/g, ' ')
    };
    setLastSearch(normalizedSearch);

    // Check cache first
    const cachedResults = getCachedResults(normalizedSearch);
    if (cachedResults) {
      console.log('Using cached results');
      setApartments(cachedResults.apartments);
      setMapCenter(cachedResults.center);
      setIsLoading(false);
      return;
    }

    try {
      // Geocode the location
      const coordinates = await geocodeLocation(
        normalizedSearch.location,
        import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      );
      setMapCenter(coordinates);

      // Fetch apartments (mock data)
      const results = generateMockApartments({
        location: normalizedSearch.location,
        radius: normalizedSearch.radius,
        features: normalizedSearch.features,
        sources: normalizedSearch.sources,
        center: coordinates
      });

      setApartments(results);
      setSelectedApartment(null);

      // Cache the results
      setCachedResults(normalizedSearch, {
        apartments: results,
        center: coordinates
      });
    } catch (error) {
      console.error('Error searching apartments:', error);
      setApartments([]);
      setErrorMessage('Could not complete search right now. Please try again.');
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
            {errorMessage && <p className="search-error">{errorMessage}</p>}
            {lastSearch && (
              <div className="search-meta">
                <span>{apartments.length} results</span>
                <span>{lastSearch.location}</span>
                <span>{lastSearch.radius} mile radius</span>
              </div>
            )}
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

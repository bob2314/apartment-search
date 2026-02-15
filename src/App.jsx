import { useState } from 'react';
import SearchForm from './components/SearchForm';
import ListingList from './components/ListingList';
import Map from './components/Map';
import { geocodeAddress } from './services/geocoding';
import { fetchListings } from './services/listingAggregator';
import { getListingsFromDB, saveListingsToDB, addListingIfNotExists, clearStaleData } from './services/database';
import { sortByDistance, generateSearchKey } from './utils/distance';
import './App.css';

function App() {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchCenter, setSearchCenter] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [fromCache, setFromCache] = useState(false);
  
  // Clear stale data on mount
  useState(() => {
    clearStaleData();
  }, []);
  
  const handleSearch = async ({ location, radius, filters }) => {
    setIsLoading(true);
    setFromCache(false);
    
    try {
      // Geocode the location
      const coords = await geocodeAddress(location);
      setSearchCenter(coords);
      
      // Generate search key for caching
      const searchKey = generateSearchKey(location, radius);
      
      // Check database first
      let cachedListings = await getListingsFromDB(searchKey);
      
      if (cachedListings) {
        // Filter cached listings
        let filteredListings = cachedListings;
        
        if (filters.amenities && filters.amenities.length > 0) {
          filteredListings = filteredListings.filter(listing => {
            return filters.amenities.every(amenity => 
              listing.amenities.includes(amenity)
            );
          });
        }
        
        if (filters.minPrice) {
          filteredListings = filteredListings.filter(listing => listing.price >= filters.minPrice);
        }
        
        if (filters.maxPrice) {
          filteredListings = filteredListings.filter(listing => listing.price <= filters.maxPrice);
        }
        
        if (filters.minBedrooms) {
          filteredListings = filteredListings.filter(listing => listing.bedrooms >= filters.minBedrooms);
        }
        
        const sortedListings = sortByDistance(filteredListings, coords.lat, coords.lng);
        setListings(sortedListings);
        setFromCache(true);
        setIsLoading(false);
        return;
      }
      
      // Fetch new listings from aggregators
      const newListings = await fetchListings(coords.lat, coords.lng, radius, filters);
      
      // Sort by distance
      const sortedListings = sortByDistance(newListings, coords.lat, coords.lng);
      
      // Save to database
      await saveListingsToDB(searchKey, sortedListings);
      
      // Add individual listings to database
      for (const listing of sortedListings) {
        await addListingIfNotExists(listing);
      }
      
      setListings(sortedListings);
      setIsLoading(false);
    } catch (error) {
      console.error('Search error:', error);
      alert('An error occurred while searching. Please try again.');
      setIsLoading(false);
    }
  };
  
  const handleListingClick = (listing) => {
    setSelectedListing(listing);
    // Scroll to map
    document.querySelector('.map-container, .map-placeholder')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'nearest'
    });
  };
  
  return (
    <div className="app">
      <div className="container">
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        
        {isLoading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Searching for apartments...</p>
          </div>
        )}
        
        {!isLoading && listings.length > 0 && (
          <>
            {fromCache && (
              <div className="cache-indicator">
                ⚡ Results loaded from cache for faster display
              </div>
            )}
            
            <Map
              center={searchCenter}
              listings={listings}
              selectedListing={selectedListing}
              onMarkerClick={setSelectedListing}
            />
            
            <ListingList
              listings={listings}
              onListingClick={handleListingClick}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;

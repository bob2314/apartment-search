/**
 * Mock listing aggregator service
 * In production, this would call multiple real estate APIs
 * (Zillow, Realtor.com, Apartments.com, etc.)
 */

const MOCK_AMENITIES = [
  'Parking', 'Gym', 'Pool', 'Pet Friendly', 'Laundry', 
  'Balcony', 'Dishwasher', 'Air Conditioning', 'Heating', 'Storage'
];

/**
 * Generate mock apartment listings
 */
const generateMockListings = (lat, lng, radius, count = 20) => {
  const listings = [];
  
  for (let i = 0; i < count; i++) {
    // Generate random location within radius (approximate)
    const radiusInDegrees = radius / 69; // 1 degree ≈ 69 miles
    const randomLat = lat + (Math.random() - 0.5) * 2 * radiusInDegrees;
    const randomLng = lng + (Math.random() - 0.5) * 2 * radiusInDegrees;
    
    // Generate random amenities
    const numAmenities = Math.floor(Math.random() * 6) + 3;
    const amenities = [];
    const amenitiesCopy = [...MOCK_AMENITIES];
    for (let j = 0; j < numAmenities; j++) {
      const idx = Math.floor(Math.random() * amenitiesCopy.length);
      amenities.push(amenitiesCopy.splice(idx, 1)[0]);
    }
    
    listings.push({
      id: `listing_${Date.now()}_${i}`,
      title: `${Math.floor(Math.random() * 3) + 1}BR Apartment`,
      address: `${Math.floor(Math.random() * 9999) + 1000} Main St`,
      city: 'City',
      state: 'State',
      zipcode: String(Math.floor(Math.random() * 90000) + 10000),
      price: Math.floor(Math.random() * 3000) + 800,
      bedrooms: Math.floor(Math.random() * 3) + 1,
      bathrooms: Math.floor(Math.random() * 2) + 1,
      sqft: Math.floor(Math.random() * 1500) + 500,
      amenities,
      lat: randomLat,
      lng: randomLng,
      source: ['Zillow', 'Realtor.com', 'Apartments.com'][Math.floor(Math.random() * 3)],
      imageUrl: `https://via.placeholder.com/400x300?text=Apartment+${i + 1}`,
      description: 'Beautiful apartment in a great location with modern amenities.',
      availableDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
  }
  
  return listings;
};

/**
 * Fetch listings from multiple aggregators
 */
export const fetchListings = async (lat, lng, radius, filters = {}) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate mock listings
  let listings = generateMockListings(lat, lng, radius, 30);
  
  // Apply filters
  if (filters.amenities && filters.amenities.length > 0) {
    listings = listings.filter(listing => {
      return filters.amenities.every(amenity => 
        listing.amenities.includes(amenity)
      );
    });
  }
  
  if (filters.minPrice) {
    listings = listings.filter(listing => listing.price >= filters.minPrice);
  }
  
  if (filters.maxPrice) {
    listings = listings.filter(listing => listing.price <= filters.maxPrice);
  }
  
  if (filters.minBedrooms) {
    listings = listings.filter(listing => listing.bedrooms >= filters.minBedrooms);
  }
  
  return listings;
};

/**
 * Get all available amenities
 */
export const getAvailableAmenities = () => {
  return MOCK_AMENITIES;
};

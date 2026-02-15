/**
 * Geocoding service using Google Maps Geocoding API
 * For demo purposes, this includes a fallback mock implementation
 */

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

/**
 * Mock geocoding data for common locations
 */
const MOCK_LOCATIONS = {
  '10001': { lat: 40.7506, lng: -73.9971, formatted: 'New York, NY 10001' },
  '90001': { lat: 33.9731, lng: -118.2479, formatted: 'Los Angeles, CA 90001' },
  '60601': { lat: 41.8858, lng: -87.6230, formatted: 'Chicago, IL 60601' },
  '77001': { lat: 29.7490, lng: -95.3587, formatted: 'Houston, TX 77001' },
  '85001': { lat: 33.4484, lng: -112.0740, formatted: 'Phoenix, AZ 85001' },
  '19019': { lat: 39.9526, lng: -75.1652, formatted: 'Philadelphia, PA 19019' },
  '78701': { lat: 30.2672, lng: -97.7431, formatted: 'Austin, TX 78701' },
  '94101': { lat: 37.7749, lng: -122.4194, formatted: 'San Francisco, CA 94101' },
  '02101': { lat: 42.3601, lng: -71.0589, formatted: 'Boston, MA 02101' },
  '98101': { lat: 47.6062, lng: -122.3321, formatted: 'Seattle, WA 98101' }
};

/**
 * Convert address to coordinates
 */
export const geocodeAddress = async (address) => {
  try {
    // Check if it's a zipcode in our mock data
    const zipMatch = address.match(/\d{5}/);
    if (zipMatch && MOCK_LOCATIONS[zipMatch[0]]) {
      return MOCK_LOCATIONS[zipMatch[0]];
    }
    
    // If Google Maps API key is available, use it
    if (GOOGLE_MAPS_API_KEY) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return {
          lat: location.lat,
          lng: location.lng,
          formatted: data.results[0].formatted_address
        };
      }
    }
    
    // Fallback to first mock location
    const firstZip = Object.keys(MOCK_LOCATIONS)[0];
    return MOCK_LOCATIONS[firstZip];
  } catch (error) {
    console.error('Geocoding error:', error);
    // Return default location
    return MOCK_LOCATIONS['10001'];
  }
};

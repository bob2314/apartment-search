/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in miles
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

/**
 * Convert degrees to radians
 */
const toRad = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Format distance for display
 */
export const formatDistance = (distance) => {
  if (distance < 0.1) {
    return '< 0.1 mi';
  }
  return `${distance.toFixed(1)} mi`;
};

/**
 * Sort listings by distance from origin
 */
export const sortByDistance = (listings, originLat, originLng) => {
  return listings
    .map(listing => ({
      ...listing,
      distance: calculateDistance(originLat, originLng, listing.lat, listing.lng)
    }))
    .sort((a, b) => a.distance - b.distance);
};

/**
 * Generate a search key for database caching
 */
export const generateSearchKey = (location, radius) => {
  return `search_${location}_${radius}`;
};

const SOURCE_NAMES = {
  apartmentsCom: 'Apartments.com',
  googleMaps: 'Google Maps',
  zillow: 'Zillow',
  realtor: 'Realtor.com'
};

const SOURCE_PATHS = {
  apartmentsCom: 'apartments.com',
  googleMaps: 'google.com/maps/search',
  zillow: 'zillow.com',
  realtor: 'realtor.com/apartments'
};

const SOURCE_OFFSETS = {
  apartmentsCom: { lat: 0.009, lng: -0.011 },
  googleMaps: { lat: -0.005, lng: 0.015 },
  zillow: { lat: 0.013, lng: 0.006 },
  realtor: { lat: -0.011, lng: -0.008 }
};

const FEATURE_POOL = [
  'parking',
  'gym',
  'pool',
  'petFriendly',
  'laundry',
  'airConditioning',
  'dishwasher',
  'balcony'
];

const IMAGE_POOL = [
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1502672260066-6bc176c6864a?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop'
];

const CITY_COORDINATE_FALLBACKS = {
  philadelphia: { lat: 39.9526, lng: -75.1652 },
  'philadelphia pa': { lat: 39.9526, lng: -75.1652 },
  'new york': { lat: 40.7128, lng: -74.0060 },
  'new york ny': { lat: 40.7128, lng: -74.0060 },
  'santa monica': { lat: 34.0195, lng: -118.4912 },
  'santa monica ca': { lat: 34.0195, lng: -118.4912 }
};

const isLikelyGoogleApiKey = (apiKey) => typeof apiKey === 'string' && apiKey.startsWith('AIza');

const normalizeLocationKey = (location) => location.trim().toLowerCase().replace(',', '');

const degreesPerMileLat = 1 / 69;
const degreesPerMileLngAt = (lat) => 1 / (69 * Math.cos((lat * Math.PI) / 180));

const calculateDistanceMiles = (lat1, lng1, lat2, lng2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const earthRadiusMi = 3958.8;
  const latDiff = toRad(lat2 - lat1);
  const lngDiff = toRad(lng2 - lng1);
  const a = Math.sin(latDiff / 2) ** 2
    + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(lngDiff / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusMi * c;
};

const getFeaturesForIndex = (index) => {
  const start = index % FEATURE_POOL.length;
  return [
    FEATURE_POOL[start],
    FEATURE_POOL[(start + 2) % FEATURE_POOL.length],
    FEATURE_POOL[(start + 4) % FEATURE_POOL.length],
    FEATURE_POOL[(start + 6) % FEATURE_POOL.length]
  ];
};

const buildMockListing = ({ center, radius, source, index, locationLabel }) => {
  const sourceOffset = SOURCE_OFFSETS[source] || { lat: 0, lng: 0 };
  const spreadMiles = Math.max(radius * 0.35, 1.2);
  const angle = (Math.PI / 4) * ((index % 8) + 1);
  const radialMiles = Math.max(0.4, ((index % 4) + 1) * (spreadMiles / 4));
  const latOffset = (Math.sin(angle) * radialMiles * degreesPerMileLat) + sourceOffset.lat;
  const lngOffset = (Math.cos(angle) * radialMiles * degreesPerMileLngAt(center.lat)) + sourceOffset.lng;
  const latitude = center.lat + latOffset;
  const longitude = center.lng + lngOffset;
  const features = getFeaturesForIndex(index + source.length);
  const distance = calculateDistanceMiles(center.lat, center.lng, latitude, longitude);
  const beds = (index % 4) + 1;
  const baths = beds > 2 ? beds - 0.5 : beds;
  const priceBase = 1450 + (index * 160) + (beds * 225);

  return {
    id: `${source}-${index}`,
    name: `${SOURCE_NAMES[source]} Listing ${index + 1}`,
    source: SOURCE_NAMES[source],
    listingUrl: `https://${SOURCE_PATHS[source]}/${encodeURIComponent(locationLabel)}?listing=${index + 1}`,
    address: `${100 + (index * 17)} Market St, ${locationLabel}`,
    price: Math.round(priceBase / 25) * 25,
    bedrooms: beds,
    bathrooms: baths,
    sqft: 600 + (beds * 220) + (index * 25),
    latitude,
    longitude,
    distance,
    image: IMAGE_POOL[index % IMAGE_POOL.length],
    features
  };
};

const generateMockApartments = ({
  location,
  radius,
  features = [],
  sources = [],
  center
}) => {
  const activeSources = sources.length > 0 ? sources : Object.keys(SOURCE_NAMES);
  const seedCenter = center || CITY_COORDINATE_FALLBACKS[normalizeLocationKey(location)] || { lat: 39.9526, lng: -75.1652 };
  const listingsPerSource = 6;
  const allListings = [];

  activeSources.forEach((source) => {
    for (let i = 0; i < listingsPerSource; i += 1) {
      allListings.push(buildMockListing({
        center: seedCenter,
        radius,
        source,
        index: i,
        locationLabel: location
      }));
    }
  });

  let filtered = allListings.filter((apartment) => apartment.distance <= radius);

  if (features.length > 0) {
    filtered = filtered.filter((apartment) => features.every((feature) => apartment.features.includes(feature)));
  }

  filtered.sort((a, b) => a.distance - b.distance || a.price - b.price);
  return filtered;
};

const geocodeLocation = async (location, apiKey) => {
  const trimmedLocation = location.trim();
  if (!trimmedLocation) {
    throw new Error('Please enter a valid location.');
  }

  try {
    const proxyResponse = await fetch(`/api/geocode?location=${encodeURIComponent(trimmedLocation)}`);
    if (proxyResponse.ok) {
      const proxyData = await proxyResponse.json();
      if (proxyData.lat && proxyData.lng) {
        return {
          lat: proxyData.lat,
          lng: proxyData.lng,
          formatted_address: proxyData.formatted_address || trimmedLocation
        };
      }
    }
  } catch (error) {
    console.warn('Server geocode endpoint unavailable, attempting client fallback.', error);
  }

  // Local fallback for plain Vite dev (without Netlify Functions running).
  if (isLikelyGoogleApiKey(apiKey)) {
    try {
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(trimmedLocation)}&key=${apiKey}`;
      const response = await fetch(geocodeUrl);
      const data = await response.json();

      if (data.status === 'OK' && data.results && data.results[0]) {
        const result = data.results[0];
        return {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
          formatted_address: result.formatted_address
        };
      }
    } catch (error) {
      console.warn('Google geocoding request failed, falling back to local matching.', error);
    }
  }

  const fallback = CITY_COORDINATE_FALLBACKS[normalizeLocationKey(trimmedLocation)] || { lat: 39.9526, lng: -75.1652 };
  return {
    ...fallback,
    formatted_address: trimmedLocation
  };
};

export { generateMockApartments, geocodeLocation, isLikelyGoogleApiKey };

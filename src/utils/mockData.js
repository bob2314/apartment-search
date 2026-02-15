// Mock apartment data generator
// In a real application, this would fetch from multiple listing APIs
// (e.g., Zillow, Realtor.com, Apartments.com, etc.)

const generateMockApartments = (location, radius, features = []) => {
  // Mock apartment listings with various features
  const mockListings = [
    {
      id: 1,
      name: 'Luxury Downtown Apartments',
      address: '123 Main St, New York, NY 10001',
      price: 3200,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1100,
      latitude: 40.7489,
      longitude: -73.9680,
      distance: 2.3,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
      features: ['parking', 'gym', 'pool', 'petFriendly']
    },
    {
      id: 2,
      name: 'Modern Studio Living',
      address: '456 Park Ave, New York, NY 10016',
      price: 2400,
      bedrooms: 1,
      bathrooms: 1,
      sqft: 650,
      latitude: 40.7450,
      longitude: -73.9750,
      distance: 1.8,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
      features: ['gym', 'laundry', 'airConditioning']
    },
    {
      id: 3,
      name: 'Riverside Heights',
      address: '789 River Rd, New York, NY 10002',
      price: 3800,
      bedrooms: 3,
      bathrooms: 2.5,
      sqft: 1500,
      latitude: 40.7200,
      longitude: -73.9900,
      distance: 3.5,
      image: 'https://images.unsplash.com/photo-1502672260066-6bc176c6864a?w=400&h=300&fit=crop',
      features: ['parking', 'pool', 'balcony', 'dishwasher', 'petFriendly']
    },
    {
      id: 4,
      name: 'Urban Oasis Apartments',
      address: '321 Broadway, New York, NY 10007',
      price: 2900,
      bedrooms: 2,
      bathrooms: 1.5,
      sqft: 950,
      latitude: 40.7150,
      longitude: -74.0070,
      distance: 4.2,
      image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=400&h=300&fit=crop',
      features: ['gym', 'laundry', 'parking']
    },
    {
      id: 5,
      name: 'Skyline Residences',
      address: '555 5th Ave, New York, NY 10017',
      price: 4500,
      bedrooms: 3,
      bathrooms: 3,
      sqft: 1800,
      latitude: 40.7550,
      longitude: -73.9790,
      distance: 1.2,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
      features: ['parking', 'gym', 'pool', 'balcony', 'dishwasher', 'airConditioning']
    },
    {
      id: 6,
      name: 'Garden View Apartments',
      address: '888 Garden St, New York, NY 10003',
      price: 2600,
      bedrooms: 1,
      bathrooms: 1,
      sqft: 750,
      latitude: 40.7320,
      longitude: -73.9900,
      distance: 2.7,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
      features: ['laundry', 'balcony', 'petFriendly']
    },
    {
      id: 7,
      name: 'Metro Central Suites',
      address: '999 Central Park W, New York, NY 10025',
      price: 5200,
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2200,
      latitude: 40.7850,
      longitude: -73.9700,
      distance: 5.1,
      image: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=400&h=300&fit=crop',
      features: ['parking', 'gym', 'pool', 'balcony', 'dishwasher', 'airConditioning', 'petFriendly']
    },
    {
      id: 8,
      name: 'The Chelsea Lofts',
      address: '234 Chelsea St, New York, NY 10011',
      price: 3100,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      latitude: 40.7430,
      longitude: -74.0020,
      distance: 3.0,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
      features: ['gym', 'dishwasher', 'laundry']
    }
  ];

  // Filter by radius (mock - in real app would use geolocation)
  let filtered = mockListings.filter(apt => apt.distance <= radius);

  // Filter by features
  if (features.length > 0) {
    filtered = filtered.filter(apt => 
      features.some(feature => apt.features.includes(feature))
    );
  }

  // Sort by distance
  filtered.sort((a, b) => a.distance - b.distance);

  return filtered;
};

// Geocode location to coordinates
// In a real app, this would use Google Geocoding API
const geocodeLocation = async (location) => {
  // Mock geocoding - returns NYC coordinates for any location
  // In production, use Google Geocoding API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        lat: 40.7128,
        lng: -74.0060,
        formatted_address: location
      });
    }, 500);
  });
};

export { generateMockApartments, geocodeLocation };

# Apartment Search

A modern, full-featured apartment search application built with React and Vite.

## Features

- 🔍 **Advanced Search**: Search by city, state, or zipcode with configurable radius (in miles)
- 🗺️ **Google Maps Integration**: Visualize apartments on an interactive map
- 🎯 **Smart Filtering**: Filter by price, bedrooms, and amenities using checkboxes
- 📊 **Multi-Source Listings**: Aggregates results from multiple listing sources
- ⚡ **Fast Performance**: NoSQL database caching for instant results
- 📍 **Distance Sorting**: Listings automatically sorted by distance from search location
- 🔄 **Auto-Update**: Automatically refreshes listings older than one week
- 💾 **Smart Caching**: Stores listings locally for faster subsequent searches

## Technologies Used

- **React 19** - Modern UI framework
- **React Router** - Client-side routing
- **Vite** - Lightning-fast build tool
- **Google Maps API** - Map visualization and geocoding
- **LocalForage** - NoSQL database for client-side storage
- **Axios** - HTTP client for API requests

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bob2314/apartment-search.git
cd apartment-search
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Set up Google Maps API:
   - Get an API key from [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
   - Copy `.env.example` to `.env`
   - Add your API key to `.env`:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Search for Apartments**:
   - Enter a city, state, or zipcode in the search field
   - Adjust the search radius using the slider (1-50 miles)
   - Apply filters for price, bedrooms, and amenities
   - Click "Search Apartments"

2. **View Results**:
   - Listings are displayed in a grid, sorted by distance
   - Each card shows key information: price, location, size, amenities
   - Click on a listing card to highlight it on the map

3. **Map Interaction**:
   - Blue marker indicates your search center
   - Red markers show apartment locations
   - Green marker indicates selected apartment
   - Click markers to see apartment details

4. **Smart Caching**:
   - First search fetches fresh data from listing aggregators
   - Subsequent searches use cached data for instant results
   - Data automatically refreshes after one week

## Project Structure

```
src/
├── components/          # React components
│   ├── SearchForm.jsx   # Search input and filters
│   ├── ListingList.jsx  # Grid of listing cards
│   ├── ListingCard.jsx  # Individual listing display
│   └── Map.jsx          # Google Maps component
├── services/            # Business logic
│   ├── database.js      # LocalForage database operations
│   ├── geocoding.js     # Address to coordinates conversion
│   └── listingAggregator.js  # Fetch listings from multiple sources
├── utils/               # Utility functions
│   └── distance.js      # Distance calculations and sorting
└── App.jsx              # Main application component
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready to deploy to any static hosting service.

## Future Enhancements

- Integration with real listing APIs (Zillow, Realtor.com, Apartments.com)
- User authentication and saved searches
- Favorite listings functionality
- Email alerts for new listings
- Mobile app version
- Advanced filters (parking, pets, utilities included, etc.)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

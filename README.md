# 🏠 Apartment Search

A modern React-based apartment search application with comprehensive search features, interactive maps, and intuitive filtering.

## Features

✨ **Core Features:**
- 🔍 **Location Search**: Search by city, state, or zip code
- 📍 **Radius Search**: Customize search radius (5-50 miles)
- ✅ **Feature Filters**: Filter apartments by desired amenities:
  - Parking
  - Gym
  - Pool
  - Pet Friendly
  - Laundry
  - Air Conditioning
  - Dishwasher
  - Balcony
- 🗺️ **Google Maps Integration**: Interactive map view with markers for each listing
- 📊 **List View**: Detailed apartment listings sorted by distance
- 💾 **Smart Caching**: localStorage-based caching for faster repeat searches (30-minute cache)
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## Tech Stack

- **Frontend**: React 19 + Vite
- **Routing**: React Router DOM
- **Maps**: Google Maps API (@react-google-maps/api)
- **Storage**: localStorage (NoSQL-like caching)
- **Styling**: CSS3 with modern design patterns

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Maps API key (for map functionality)

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

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Add your Google Maps API key to `.env`:
```
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

**Getting a Google Maps API Key:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "Maps JavaScript API"
4. Create credentials (API Key)
5. Copy the API key to your `.env` file

### Running the Application

**Development mode:**
```bash
npm run dev
```
The app will be available at `http://localhost:5173/`

**Production build:**
```bash
npm run build
npm run preview
```

**Linting:**
```bash
npm run lint
```

## Project Structure

```
apartment-search/
├── src/
│   ├── components/        # React components
│   │   ├── SearchForm.jsx      # Search form with filters
│   │   ├── ApartmentList.jsx   # List view of apartments
│   │   └── MapView.jsx         # Google Maps integration
│   ├── pages/             # Page components
│   │   └── SearchPage.jsx      # Main search page
│   ├── hooks/             # Custom React hooks
│   │   └── useApartmentCache.js # Caching logic
│   ├── utils/             # Utility functions
│   │   └── mockData.js         # Mock data generator
│   ├── App.jsx            # Main app component
│   └── main.jsx           # App entry point
├── public/                # Static assets
├── .env.example           # Environment variables template
└── package.json           # Dependencies and scripts
```

## Usage

1. **Enter Location**: Type a city, state, or zip code (e.g., "New York, NY" or "10001")
2. **Set Radius**: Choose your search radius from 5 to 50 miles
3. **Select Features**: Check desired apartment amenities
4. **Search**: Click "Search Apartments" to see results
5. **View Results**: Toggle between List View and Map View
6. **Explore**: Click on listings to see more details or interact with map markers

## Data Sources

**Current Implementation:**
The app currently uses mock data for demonstration purposes. The mock data includes realistic apartment listings with various features, locations, and prices.

**Production Implementation:**
In a production environment, integrate with apartment listing APIs such as:
- Zillow API
- Realtor.com API
- Apartments.com API
- Rentals.com API
- Other third-party apartment listing aggregators

Replace the `generateMockApartments` function in `src/utils/mockData.js` with actual API calls.

## Caching Strategy

The application implements smart caching using localStorage:
- Search results are cached for 30 minutes
- Cache key is based on search parameters (location, radius, features)
- Automatic cache invalidation after expiry
- Significantly improves performance for repeated searches

## Customization

### Adding New Features

1. Add new feature to `SearchForm.jsx`:
```javascript
const [features, setFeatures] = useState({
  // ... existing features
  newFeature: false
});
```

2. Update the mock data in `src/utils/mockData.js` to include the feature

### Styling

All components have separate CSS files for easy customization. Main color scheme uses green (#4CAF50) for primary actions.

## Future Enhancements

- [ ] Real-time API integration with multiple listing services
- [ ] User authentication and saved searches
- [ ] Favorite/bookmark listings
- [ ] Advanced filtering (price range, square footage, etc.)
- [ ] Comparison tool for multiple listings
- [ ] Email notifications for new listings
- [ ] Backend API with database (MongoDB/PostgreSQL)
- [ ] Unit and integration tests
- [ ] Performance optimization for large result sets

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Made with ❤️ using React and Vite

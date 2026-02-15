import './ApartmentList.css';

const ApartmentList = ({ apartments, onSelectApartment }) => {
  if (!apartments || apartments.length === 0) {
    return (
      <div className="no-results">
        <p>No apartments found. Try adjusting your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="apartment-list">
      <h2>Found {apartments.length} Apartments</h2>
      <div className="list-container">
        {apartments.map((apartment) => (
          <div
            key={apartment.id}
            className="apartment-card"
            onClick={() => onSelectApartment(apartment)}
          >
            <div className="apartment-image">
              <img src={apartment.image} alt={apartment.name} />
            </div>
            <div className="apartment-details">
              <h3>{apartment.name}</h3>
              <p className="address">{apartment.address}</p>
              <div className="apartment-info">
                <span className="price">${apartment.price}/mo</span>
                <span className="beds">{apartment.bedrooms} bd</span>
                <span className="baths">{apartment.bathrooms} ba</span>
                <span className="sqft">{apartment.sqft} sqft</span>
              </div>
              <div className="distance">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C5.2 0 3 2.2 3 5c0 3.9 5 11 5 11s5-7.1 5-11c0-2.8-2.2-5-5-5zm0 7.5c-1.4 0-2.5-1.1-2.5-2.5S6.6 2.5 8 2.5s2.5 1.1 2.5 2.5S9.4 7.5 8 7.5z"/>
                </svg>
                {apartment.distance.toFixed(1)} miles away
              </div>
              {apartment.features && apartment.features.length > 0 && (
                <div className="features-tags">
                  {apartment.features.map((feature, idx) => (
                    <span key={idx} className="feature-tag">{feature}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApartmentList;

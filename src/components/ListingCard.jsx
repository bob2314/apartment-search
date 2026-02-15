import { formatDistance } from '../utils/distance';
import './ListingCard.css';

const ListingCard = ({ listing, onClick }) => {
  return (
    <div className="listing-card" onClick={() => onClick(listing)}>
      <div className="listing-image">
        <img src={listing.imageUrl} alt={listing.title} />
        <div className="listing-distance">{formatDistance(listing.distance)}</div>
      </div>
      
      <div className="listing-content">
        <div className="listing-header">
          <h3>{listing.title}</h3>
          <div className="listing-price">${listing.price}/mo</div>
        </div>
        
        <div className="listing-address">
          {listing.address}, {listing.city}, {listing.state} {listing.zipcode}
        </div>
        
        <div className="listing-details">
          <span>{listing.bedrooms} bed</span>
          <span>•</span>
          <span>{listing.bathrooms} bath</span>
          <span>•</span>
          <span>{listing.sqft} sqft</span>
        </div>
        
        {listing.amenities && listing.amenities.length > 0 && (
          <div className="listing-amenities">
            {listing.amenities.slice(0, 3).map((amenity, idx) => (
              <span key={idx} className="amenity-tag">{amenity}</span>
            ))}
            {listing.amenities.length > 3 && (
              <span className="amenity-tag">+{listing.amenities.length - 3} more</span>
            )}
          </div>
        )}
        
        <div className="listing-footer">
          <span className="listing-source">{listing.source}</span>
          <span className="listing-available">Available: {listing.availableDate}</span>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;

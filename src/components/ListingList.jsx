import ListingCard from './ListingCard';
import './ListingList.css';

const ListingList = ({ listings, onListingClick }) => {
  if (!listings || listings.length === 0) {
    return (
      <div className="listing-list-empty">
        <h3>No listings found</h3>
        <p>Try adjusting your search criteria or radius</p>
      </div>
    );
  }
  
  return (
    <div className="listing-list">
      <div className="listing-list-header">
        <h2>Found {listings.length} apartments</h2>
        <p>Sorted by distance from search location</p>
      </div>
      
      <div className="listing-grid">
        {listings.map(listing => (
          <ListingCard
            key={listing.id}
            listing={listing}
            onClick={onListingClick}
          />
        ))}
      </div>
    </div>
  );
};

export default ListingList;

import localforage from 'localforage';

// Configure localforage (NoSQL DB)
const db = localforage.createInstance({
  name: 'apartment-search',
  storeName: 'listings'
});

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Check if listing data is stale (older than 1 week)
 */
export const isDataStale = (timestamp) => {
  if (!timestamp) return true;
  return Date.now() - timestamp > ONE_WEEK_MS;
};

/**
 * Get listings from database by search key
 */
export const getListingsFromDB = async (searchKey) => {
  try {
    const data = await db.getItem(searchKey);
    if (!data) return null;
    
    // Check if data is stale
    if (isDataStale(data.timestamp)) {
      return null;
    }
    
    return data.listings;
  } catch (error) {
    console.error('Error getting listings from DB:', error);
    return null;
  }
};

/**
 * Save listings to database
 */
export const saveListingsToDB = async (searchKey, listings) => {
  try {
    await db.setItem(searchKey, {
      listings,
      timestamp: Date.now()
    });
    return true;
  } catch (error) {
    console.error('Error saving listings to DB:', error);
    return false;
  }
};

/**
 * Add a single listing to database if it doesn't exist
 */
export const addListingIfNotExists = async (listing) => {
  try {
    const listingKey = `listing_${listing.id}`;
    const existingListing = await db.getItem(listingKey);
    
    if (!existingListing) {
      await db.setItem(listingKey, {
        ...listing,
        timestamp: Date.now()
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error adding listing:', error);
    return false;
  }
};

/**
 * Clear all stale data from database
 */
export const clearStaleData = async () => {
  try {
    const keys = await db.keys();
    const promises = keys.map(async (key) => {
      const data = await db.getItem(key);
      if (data && isDataStale(data.timestamp)) {
        await db.removeItem(key);
      }
    });
    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error('Error clearing stale data:', error);
    return false;
  }
};

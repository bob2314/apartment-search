// Custom hook for caching apartment search results
// Uses localStorage as a simple NoSQL-like storage
const useApartmentCache = () => {
  const CACHE_KEY = 'apartment_search_cache';
  const CACHE_EXPIRY = 1000 * 60 * 30; // 30 minutes
  const hasStorage = typeof window !== 'undefined' && window.localStorage;

  const getCachedResults = (searchParams) => {
    if (!hasStorage) return null;

    try {
      const cache = localStorage.getItem(CACHE_KEY);
      if (!cache) return null;

      const parsed = JSON.parse(cache);
      const cacheKey = JSON.stringify(searchParams);

      if (parsed[cacheKey]) {
        const { data, timestamp } = parsed[cacheKey];
        const now = Date.now();

        // Check if cache is still valid
        if (now - timestamp < CACHE_EXPIRY) {
          return data;
        }
      }
      return null;
    } catch (error) {
      console.error('Error reading cache:', error);
      return null;
    }
  };

  const setCachedResults = (searchParams, data) => {
    if (!hasStorage) return;

    try {
      const cache = localStorage.getItem(CACHE_KEY);
      const parsed = cache ? JSON.parse(cache) : {};
      const cacheKey = JSON.stringify(searchParams);

      parsed[cacheKey] = {
        data,
        timestamp: Date.now()
      };

      localStorage.setItem(CACHE_KEY, JSON.stringify(parsed));
    } catch (error) {
      console.error('Error writing cache:', error);
    }
  };

  const clearCache = () => {
    if (!hasStorage) return;

    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  return {
    getCachedResults,
    setCachedResults,
    clearCache
  };
};

export default useApartmentCache;

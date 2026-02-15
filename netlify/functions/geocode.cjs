const GOOGLE_GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

const buildJsonResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    'content-type': 'application/json',
    'cache-control': 'public, max-age=300'
  },
  body: JSON.stringify(body)
});

exports.handler = async (event) => {
  const location = event.queryStringParameters?.location?.trim();
  if (!location) {
    return buildJsonResponse(400, { error: 'Missing required query parameter: location' });
  }

  const apiKey = process.env.GOOGLE_MAPS_SERVER_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey || !apiKey.startsWith('AIza')) {
    return buildJsonResponse(500, {
      error: 'Server API key is not configured. Set GOOGLE_MAPS_SERVER_API_KEY in Netlify env vars.'
    });
  }

  try {
    const geocodeUrl = `${GOOGLE_GEOCODE_URL}?address=${encodeURIComponent(location)}&key=${apiKey}`;
    const response = await fetch(geocodeUrl);
    const payload = await response.json();

    if (payload.status !== 'OK' || !payload.results?.[0]) {
      return buildJsonResponse(404, {
        error: 'No geocoding result found for the requested location.',
        status: payload.status
      });
    }

    const result = payload.results[0];
    return buildJsonResponse(200, {
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
      formatted_address: result.formatted_address
    });
  } catch (error) {
    return buildJsonResponse(500, {
      error: 'Failed to geocode location.',
      details: error instanceof Error ? error.message : 'Unknown server error'
    });
  }
};

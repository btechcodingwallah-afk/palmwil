// PamWill Google Maps Service & Luxury Styling Provider

declare global {
  interface Window {
    google?: any;
    __initPamwillGoogleMaps?: () => void;
  }
}

let googleMapsPromise: Promise<any> | null = null;

export const GOOGLE_MAPS_API_KEY =
  (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || '';

/**
 * Bespoke luxury minimal styling for Pamwill Google Maps
 * Obsidian & Warm Gold palette, clutter-free luxury aesthetic
 */
export const PAMWILL_LUXURY_MAP_STYLE: any[] = [
  {
    featureType: 'all',
    elementType: 'geometry',
    stylers: [{ color: '#F8F6F0' }]
  },
  {
    featureType: 'all',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#4A4238' }]
  },
  {
    featureType: 'all',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#FFFFFF' }, { weight: 2 }]
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#1F1B16' }, { weight: 'bold' }]
  },
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ECE8DD' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#FFFFFF' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#E5DFD3' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{ color: '#F0E6D2' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#D8C7A5' }]
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry.fill',
    stylers: [{ color: '#FAF7F0' }]
  },
  {
    featureType: 'transit',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#D9D3C7' }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#8C8275' }]
  }
];

/**
 * Dynamically loads the Google Maps JavaScript API with places library
 */
export function loadGoogleMaps(apiKey: string = GOOGLE_MAPS_API_KEY): Promise<any> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Window not available'));
  }

  if (window.google?.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (!apiKey || apiKey.trim() === '') {
    return Promise.reject(new Error('Google Maps API key is missing'));
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    // Check if script tag is already in DOM
    const existingScript = document.getElementById('pamwill-google-maps-script');
    if (existingScript) {
      if (window.google?.maps) {
        resolve(window.google.maps);
      } else {
        existingScript.addEventListener('load', () => resolve(window.google?.maps));
        existingScript.addEventListener('error', e => reject(e));
      }
      return;
    }

    const callbackName = '__initPamwillGoogleMaps';
    window[callbackName] = () => {
      delete window[callbackName];
      resolve(window.google.maps);
    };

    const script = document.createElement('script');
    script.id = 'pamwill-google-maps-script';
    script.type = 'text/javascript';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey.trim()}&libraries=places,geometry&callback=${callbackName}&loading=async`;
    script.async = true;
    script.defer = true;

    script.onerror = err => {
      googleMapsPromise = null;
      reject(err);
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
}

/**
 * Reverse geocodes coordinates to a readable street address.
 * Tries Google Maps Geocoder first; falls back to OpenStreetMap Nominatim.
 */
export async function reverseGeocodeCoords(lat: number, lng: number): Promise<string> {
  // 1. Try Google Maps Geocoder if Google Maps is loaded
  if (window.google?.maps?.Geocoder) {
    try {
      const geocoder = new window.google.maps.Geocoder();
      const response = await geocoder.geocode({
        location: { lat, lng }
      });

      if (response && response.results && response.results.length > 0) {
        // Return first clean street/establishment address
        const best = response.results[0].formatted_address;
        if (best) return best;
      }
    } catch (gErr) {
      // Log silently and proceed to fallback
      console.warn('[PamwillMap] Google geocoding fallback invoked:', gErr);
    }
  }

  // 2. High-accuracy OpenStreetMap Nominatim fallback (no API key required)
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      { headers: { 'Accept-Language': 'en' } }
    );
    if (res.ok) {
      const data = await res.json();
      if (data && data.display_name) {
        return data.display_name;
      }
    }
  } catch (osmErr) {
    console.warn('[PamwillMap] Nominatim fallback failed:', osmErr);
  }

  // 3. Coordinate fallback
  return `Sanctuary Pin (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`;
}

/**
 * Forward geocodes an address or query into lat/lng.
 */
export async function geocodeAddress(
  address: string
): Promise<{ latitude: number; longitude: number; formattedAddress: string } | null> {
  if (window.google?.maps?.Geocoder) {
    try {
      const geocoder = new window.google.maps.Geocoder();
      const res = await geocoder.geocode({ address });
      if (res.results && res.results[0]) {
        const loc = res.results[0].geometry.location;
        return {
          latitude: typeof loc.lat === 'function' ? loc.lat() : loc.lat,
          longitude: typeof loc.lng === 'function' ? loc.lng() : loc.lng,
          formattedAddress: res.results[0].formatted_address
        };
      }
    } catch {
      // Fall through to Nominatim
    }
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    if (res.ok) {
      const list = await res.json();
      if (list && list.length > 0) {
        return {
          latitude: parseFloat(list[0].lat),
          longitude: parseFloat(list[0].lon),
          formattedAddress: list[0].display_name
        };
      }
    }
  } catch (err) {
    console.warn('Forward geocode failed:', err);
  }

  return null;
}

/**
 * Computes great-circle distance between two GPS coordinates in kilometers using Haversine formula.
 */
export function calculateDistanceKm(
  coord1: [number, number] | { latitude: number; longitude: number; lat?: number; lng?: number },
  coord2: [number, number] | { latitude: number; longitude: number; lat?: number; lng?: number }
): number {
  const lat1 = Array.isArray(coord1) ? coord1[0] : (coord1.latitude ?? coord1.lat ?? 0);
  const lng1 = Array.isArray(coord1) ? coord1[1] : (coord1.longitude ?? coord1.lng ?? 0);
  const lat2 = Array.isArray(coord2) ? coord2[0] : (coord2.latitude ?? coord2.lat ?? 0);
  const lng2 = Array.isArray(coord2) ? coord2[1] : (coord2.longitude ?? coord2.lng ?? 0);

  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { 
  Navigation, Crosshair, ZoomIn, ZoomOut, MapPin, 
  Search, Loader2, Compass
} from 'lucide-react';
import { Booking, BookingStatus, Therapist } from '../../types';
import { 
  loadGoogleMaps, 
  GOOGLE_MAPS_API_KEY, 
  PAMWILL_LUXURY_MAP_STYLE, 
  reverseGeocodeCoords 
} from '../../services/googleMaps';

export interface PamwillMapProps {
  mode: 'tracking' | 'picker' | 'preview' | 'dispatch';
  height?: string | number;
  
  // Tracking & Preview mode props
  sanctuaryCoords?: [number, number]; // [lat, lng]
  sanctuaryAddress?: string;
  sanctuaryType?: string;
  therapistCoords?: [number, number];
  therapistName?: string;
  therapistPhoto?: string;
  therapistRating?: number;
  bookingStatus?: BookingStatus;
  accuracy?: number;
  onProgressUpdate?: (remainingKm: number, etaMin: number) => void;
  
  // Picker mode props
  pickerCoords?: [number, number];
  onPickerChange?: (coords: { latitude: number; longitude: number; placeName?: string }) => void;
  isLocating?: boolean;
  onLocateMe?: () => void;
  serviceRadiusKm?: number;
  
  // Dispatch mode props
  bookings?: Booking[];
  therapists?: Therapist[];
  onSelectBooking?: (booking: Booking) => void;
  selectedCityCoords?: [number, number];
  
  // Additional configuration
  zoomable?: boolean;
  interactive?: boolean;
  className?: string;
}

// Generate intermediate route waypoints for realistic road curved route (fallback)
function generateCurvedRoute(start: [number, number], end: [number, number]): [number, number][] {
  const [lat1, lng1] = start;
  const [lat2, lng2] = end;
  
  const midLat = (lat1 + lat2) / 2;
  const midLng = (lng1 + lng2) / 2;
  
  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;
  const offsetLat = midLat + dLng * 0.18;
  const offsetLng = midLng - dLat * 0.18;
  
  const points: [number, number][] = [];
  const steps = 30;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lat = (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * offsetLat + t * t * lat2;
    const lng = (1 - t) * (1 - t) * lng1 + 2 * (1 - t) * t * offsetLng + t * t * lng2;
    points.push([lat, lng]);
  }
  return points;
}

// Approximate distance in kilometers between two coords using Haversine formula
function calculateDistanceKm(coord1: [number, number], coord2: [number, number]): number {
  const R = 6371; // Earth radius in km
  const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
  const dLng = (coord2[1] - coord1[1]) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const PamwillMap: React.FC<PamwillMapProps> = ({
  mode,
  height = '100%',
  sanctuaryCoords = [28.4595, 77.0945], // Default DLF Magnolias Gurugram
  sanctuaryAddress = 'Sanctuary Destination',
  sanctuaryType = 'Home',
  therapistCoords = [28.4850, 77.0850], // Nearby start position (~3.5km)
  therapistName = 'Pooja Sharma',
  therapistPhoto,
  therapistRating = 4.96,
  bookingStatus = 'On the Way',
  accuracy = 6,
  onProgressUpdate,
  pickerCoords,
  onPickerChange,
  isLocating = false,
  onLocateMe,
  serviceRadiusKm,
  bookings = [],
  therapists = [],
  onSelectBooking,
  selectedCityCoords,
  zoomable = true,
  interactive = true,
  className = ''
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Engine state: 'detecting' | 'google' | 'leaflet'
  const [engine, setEngine] = useState<'detecting' | 'google' | 'leaflet'>('detecting');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [detectedAddress, setDetectedAddress] = useState<string>('');

  // Leaflet refs
  const leafletMapRef = useRef<L.Map | null>(null);
  const leafletSanctuaryMarkerRef = useRef<L.Marker | null>(null);
  const leafletTherapistMarkerRef = useRef<L.Marker | null>(null);
  const leafletRoutePolylineRef = useRef<L.Polyline | null>(null);
  const leafletAccuracyCircleRef = useRef<L.Circle | null>(null);
  const leafletPickerMarkerRef = useRef<L.Marker | null>(null);
  const leafletDispatchGroupRef = useRef<L.LayerGroup | null>(null);

  // Google Maps refs
  const googleMapRef = useRef<any>(null);
  const googlePickerMarkerRef = useRef<any>(null);
  const googleAccuracyCircleRef = useRef<any>(null);
  const googleSanctuaryMarkerRef = useRef<any>(null);
  const googleTherapistMarkerRef = useRef<any>(null);
  const googleRoutePolylineRef = useRef<any>(null);
  const googleDispatchMarkersRef = useRef<any[]>([]);

  // Dynamic animated progress (0.0 to 1.0)
  const [transitProgress, setTransitProgress] = useState<number>(() => {
    if (bookingStatus === 'Arrived' || bookingStatus === 'Service Started' || bookingStatus === 'Service Completed') {
      return 1.0;
    }
    return 0.35;
  });
  
  const [currentEtaMinutes, setCurrentEtaMinutes] = useState<number>(12);
  const [currentRemainingKm, setCurrentRemainingKm] = useState<number>(2.4);

  const centerFallback: [number, number] = selectedCityCoords || sanctuaryCoords || [28.4595, 77.0945];

  // 1. Detect and Initialize Engine (Google Maps preferred, Leaflet fallback)
  useEffect(() => {
    let isMounted = true;

    async function initEngine() {
      if (GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY.trim() !== '') {
        try {
          await loadGoogleMaps(GOOGLE_MAPS_API_KEY);
          if (isMounted) {
            setEngine('google');
            return;
          }
        } catch (err) {
          console.warn('[PamwillMap] Google Maps failed to load, falling back to Leaflet:', err);
        }
      }
      if (isMounted) {
        setEngine('leaflet');
      }
    }

    initEngine();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Geocoding helper when coordinates change in picker mode
  const handleCoordResolution = useCallback(async (lat: number, lng: number) => {
    setIsGeocoding(true);
    try {
      const placeName = await reverseGeocodeCoords(lat, lng);
      setDetectedAddress(placeName);
      if (onPickerChange) {
        onPickerChange({
          latitude: Number(lat.toFixed(6)),
          longitude: Number(lng.toFixed(6)),
          placeName
        });
      }
    } catch (e) {
      console.warn('Geocoding error:', e);
      if (onPickerChange) {
        onPickerChange({
          latitude: Number(lat.toFixed(6)),
          longitude: Number(lng.toFixed(6)),
          placeName: `Sanctuary Pin (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`
        });
      }
    } finally {
      setIsGeocoding(false);
    }
  }, [onPickerChange]);

  // ==========================================
  // GOOGLE MAPS ENGINE IMPLEMENTATION
  // ==========================================
  useEffect(() => {
    if (engine !== 'google') return;
    if (!mapContainerRef.current) return;
    if (!window.google?.maps) return;

    // Destroy existing google map instance if needed
    const gmaps = window.google.maps;
    const initialCoords = mode === 'picker' 
      ? (pickerCoords || sanctuaryCoords || [28.4595, 77.0945])
      : centerFallback;

    const mapOptions: any = {
      center: { lat: initialCoords[0], lng: initialCoords[1] },
      zoom: mode === 'dispatch' ? 12 : (serviceRadiusKm ? 12 : 15),
      styles: PAMWILL_LUXURY_MAP_STYLE,
      disableDefaultUI: true,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      gestureHandling: interactive ? 'greedy' : 'none',
      backgroundColor: '#FAF8F5'
    };

    const gMap = new gmaps.Map(mapContainerRef.current, mapOptions);
    googleMapRef.current = gMap;

    // Attach Google Places Autocomplete if search input is mounted
    if (mode === 'picker' && searchInputRef.current && gmaps.places?.Autocomplete) {
      try {
        const autocomplete = new gmaps.places.Autocomplete(searchInputRef.current, {
          componentRestrictions: { country: 'in' },
          fields: ['geometry', 'formatted_address', 'name']
        });
        autocomplete.bindTo('bounds', gMap);

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.geometry?.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            gMap.setCenter({ lat, lng });
            gMap.setZoom(serviceRadiusKm ? 12 : 16);

            if (googlePickerMarkerRef.current) {
              googlePickerMarkerRef.current.setPosition({ lat, lng });
            }
            if (googleAccuracyCircleRef.current) {
              googleAccuracyCircleRef.current.setCenter({ lat, lng });
            }

            const formatted = place.formatted_address || place.name || `Sanctuary (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`;
            setDetectedAddress(formatted);
            if (onPickerChange) {
              onPickerChange({ latitude: lat, longitude: lng, placeName: formatted });
            }
          }
        });
      } catch (err) {
        console.warn('Google Places Autocomplete initialization bypassed:', err);
      }
    }

    // MODE: PICKER
    if (mode === 'picker') {
      const pinIcon = {
        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
        fillColor: '#A9812F',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 2,
        scale: 1.8,
        anchor: new gmaps.Point(12, 22)
      };

      const marker = new gmaps.Marker({
        position: { lat: initialCoords[0], lng: initialCoords[1] },
        map: gMap,
        draggable: true,
        icon: pinIcon,
        title: serviceRadiusKm ? 'Drag to adjust your operational base location' : 'Drag to exact sanctuary entrance'
      });
      googlePickerMarkerRef.current = marker;

      const circleRadiusMeters = serviceRadiusKm ? serviceRadiusKm * 1000 : Math.max(accuracy * 2.5, 30);
      const circle = new gmaps.Circle({
        strokeColor: '#A9812F',
        strokeOpacity: serviceRadiusKm ? 0.85 : 0.5,
        strokeWeight: serviceRadiusKm ? 2 : 1,
        fillColor: '#A9812F',
        fillOpacity: serviceRadiusKm ? 0.09 : 0.12,
        map: gMap,
        center: { lat: initialCoords[0], lng: initialCoords[1] },
        radius: circleRadiusMeters
      });
      googleAccuracyCircleRef.current = circle;

      marker.addListener('dragend', () => {
        const pos = marker.getPosition();
        if (pos) {
          const lat = pos.lat();
          const lng = pos.lng();
          circle.setCenter({ lat, lng });
          handleCoordResolution(lat, lng);
        }
      });

      gMap.addListener('click', (e: any) => {
        if (e.latLng) {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          marker.setPosition({ lat, lng });
          circle.setCenter({ lat, lng });
          handleCoordResolution(lat, lng);
        }
      });
    }

    // MODE: TRACKING or PREVIEW
    if (mode === 'tracking' || mode === 'preview') {
      const sCoords = sanctuaryCoords || [28.4595, 77.0945];
      const tStartCoords = therapistCoords || [sCoords[0] + 0.024, sCoords[1] - 0.018];

      // Sanctuary Marker
      const sMarker = new gmaps.Marker({
        position: { lat: sCoords[0], lng: sCoords[1] },
        map: gMap,
        icon: {
          path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
          fillColor: '#1F1B16',
          fillOpacity: 1,
          strokeColor: '#A9812F',
          strokeWeight: 2,
          scale: 1.8,
          anchor: new gmaps.Point(12, 22)
        },
        title: `Sanctuary: ${sanctuaryAddress}`
      });
      googleSanctuaryMarkerRef.current = sMarker;

      // Accuracy Circle
      const sCircle = new gmaps.Circle({
        strokeColor: '#A9812F',
        strokeOpacity: 0.5,
        strokeWeight: 1,
        fillColor: '#A9812F',
        fillOpacity: 0.08,
        map: gMap,
        center: { lat: sCoords[0], lng: sCoords[1] },
        radius: Math.max(accuracy * 3, 25)
      });
      googleAccuracyCircleRef.current = sCircle;

      // Try Directions Service for real road route
      const directionsService = new gmaps.DirectionsService();
      directionsService.route(
        {
          origin: { lat: tStartCoords[0], lng: tStartCoords[1] },
          destination: { lat: sCoords[0], lng: sCoords[1] },
          travelMode: gmaps.TravelMode.DRIVING
        },
        (result: any, status: any) => {
          let routePath: any[] = [];
          if (status === gmaps.DirectionsStatus.OK && result.routes?.[0]?.overview_path) {
            routePath = result.routes[0].overview_path;
            const leg = result.routes[0].legs?.[0];
            if (leg) {
              const km = leg.distance?.value ? leg.distance.value / 1000 : 2.4;
              const mins = leg.duration?.value ? Math.round(leg.duration.value / 60) : 12;
              setCurrentRemainingKm(km);
              setCurrentEtaMinutes(mins);
              if (onProgressUpdate) onProgressUpdate(km, mins);
            }
          } else {
            // Fallback to curved route
            const points = generateCurvedRoute(tStartCoords, sCoords);
            routePath = points.map(p => ({ lat: p[0], lng: p[1] }));
          }

          // Polyline
          const polyline = new gmaps.Polyline({
            path: routePath,
            geodesic: true,
            strokeColor: '#A9812F',
            strokeOpacity: 0.9,
            strokeWeight: 4,
            map: gMap
          });
          googleRoutePolylineRef.current = polyline;

          // Therapist Marker on Route
          const idx = Math.min(
            Math.floor(transitProgress * (routePath.length - 1)),
            routePath.length - 1
          );
          const currentPos = routePath[idx] || { lat: tStartCoords[0], lng: tStartCoords[1] };

          const tMarker = new gmaps.Marker({
            position: currentPos,
            map: gMap,
            icon: {
              path: gmaps.SymbolPath.CIRCLE,
              scale: 11,
              fillColor: '#2E7D32',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 3
            },
            title: `${therapistName} (${bookingStatus})`
          });
          googleTherapistMarkerRef.current = tMarker;

          // Fit bounds
          const bounds = new gmaps.LatLngBounds();
          bounds.extend({ lat: sCoords[0], lng: sCoords[1] });
          bounds.extend(currentPos);
          bounds.extend({ lat: tStartCoords[0], lng: tStartCoords[1] });
          gMap.fitBounds(bounds, 50);
        }
      );
    }

    // MODE: DISPATCH
    if (mode === 'dispatch') {
      const bounds = new gmaps.LatLngBounds();

      bookings.forEach(b => {
        const lat = b.liveLocation?.latitude || 28.4595;
        const lng = b.liveLocation?.longitude || 77.0945;
        bounds.extend({ lat, lng });

        const m = new gmaps.Marker({
          position: { lat, lng },
          map: gMap,
          icon: {
            path: gmaps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: b.status === 'On the Way' ? '#C28929' : '#4C6B4F',
            fillOpacity: 1,
            strokeColor: '#1F1B16',
            strokeWeight: 2
          },
          title: `#${b.id} - ${b.customerName}`
        });
        if (onSelectBooking) {
          m.addListener('click', () => onSelectBooking(b));
        }
        googleDispatchMarkersRef.current.push(m);
      });

      therapists.forEach(t => {
        if (!t.currentLocation) return;
        const lat = t.currentLocation.latitude;
        const lng = t.currentLocation.longitude;
        bounds.extend({ lat, lng });

        const m = new gmaps.Marker({
          position: { lat, lng },
          map: gMap,
          icon: {
            path: gmaps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 5,
            fillColor: t.isOnline ? '#4C6B4F' : '#9A8F82',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 1.5
          },
          title: `${t.fullName} (${t.isOnline ? 'Online' : 'Offline'})`
        });
        googleDispatchMarkersRef.current.push(m);
      });

      if (!bounds.isEmpty()) {
        gMap.fitBounds(bounds, 50);
      }
    }

    return () => {
      // Clean up google markers
      if (googlePickerMarkerRef.current) googlePickerMarkerRef.current.setMap(null);
      if (googleAccuracyCircleRef.current) googleAccuracyCircleRef.current.setMap(null);
      if (googleSanctuaryMarkerRef.current) googleSanctuaryMarkerRef.current.setMap(null);
      if (googleTherapistMarkerRef.current) googleTherapistMarkerRef.current.setMap(null);
      if (googleRoutePolylineRef.current) googleRoutePolylineRef.current.setMap(null);
      googleDispatchMarkersRef.current.forEach(m => m.setMap(null));
      googleDispatchMarkersRef.current = [];
    };
  }, [engine, mode]);

  // Sync Google Picker Coords when prop changes (e.g. from GPS button)
  useEffect(() => {
    if (engine !== 'google') return;
    if (mode !== 'picker') return;
    if (!pickerCoords || !googlePickerMarkerRef.current) return;

    const [lat, lng] = pickerCoords;
    googlePickerMarkerRef.current.setPosition({ lat, lng });
    if (googleAccuracyCircleRef.current) {
      googleAccuracyCircleRef.current.setCenter({ lat, lng });
    }
    if (googleMapRef.current) {
      googleMapRef.current.panTo({ lat, lng });
    }
  }, [engine, mode, pickerCoords]);

  // ==========================================
  // LEAFLET ENGINE IMPLEMENTATION (FALLBACK)
  // ==========================================
  useEffect(() => {
    if (engine !== 'leaflet') return;
    if (!mapContainerRef.current) return;

    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: centerFallback,
      zoom: mode === 'dispatch' ? 12 : 14,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: interactive,
      dragging: interactive,
      touchZoom: interactive,
      doubleClickZoom: interactive,
    });

    const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    });
    tileLayer.addTo(map);
    leafletMapRef.current = map;

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      clearTimeout(timer);
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [engine]);

  // Leaflet Picker Mode
  useEffect(() => {
    if (engine !== 'leaflet') return;
    const map = leafletMapRef.current;
    if (!map || mode !== 'picker') return;

    if (leafletPickerMarkerRef.current) map.removeLayer(leafletPickerMarkerRef.current);
    if (leafletAccuracyCircleRef.current) map.removeLayer(leafletAccuracyCircleRef.current);

    const initial = pickerCoords || sanctuaryCoords || [28.4595, 77.0945];

    const pickerIcon = L.divIcon({
      className: 'luxury-marker-picker',
      html: `
        <div class="picker-pin-bounce">
          <div class="sanctuary-pin-head" style="background: #A9812F; border-color: #FFFFFF;">
            <div class="sanctuary-pin-icon" style="color: #FFFFFF;">📍</div>
          </div>
        </div>
        <div class="sanctuary-pin-shadow" style="width: 14px; background: rgba(169, 129, 47, 0.4);"></div>
      `,
      iconSize: [36, 44],
      iconAnchor: [18, 40]
    });

    const marker = L.marker(initial, {
      icon: pickerIcon,
      draggable: true
    }).addTo(map);
    leafletPickerMarkerRef.current = marker;

    const circleRadiusMeters = serviceRadiusKm ? serviceRadiusKm * 1000 : Math.max(accuracy * 2.5, 30);
    const circle = L.circle(initial, {
      radius: circleRadiusMeters,
      color: '#A9812F',
      weight: serviceRadiusKm ? 2 : 1.5,
      fillColor: '#A9812F',
      fillOpacity: serviceRadiusKm ? 0.09 : 0.12
    }).addTo(map);
    leafletAccuracyCircleRef.current = circle;

    map.setView(initial, serviceRadiusKm ? 12 : 15);

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      circle.setLatLng(pos);
      handleCoordResolution(pos.lat, pos.lng);
    });

    map.on('click', (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      circle.setLatLng(e.latlng);
      handleCoordResolution(e.latlng.lat, e.latlng.lng);
    });

    return () => {
      map.off('click');
    };
  }, [engine, mode, pickerCoords, accuracy, handleCoordResolution]);

  // Leaflet Tracking Mode
  useEffect(() => {
    if (engine !== 'leaflet') return;
    const map = leafletMapRef.current;
    if (!map || (mode !== 'tracking' && mode !== 'preview')) return;

    if (leafletSanctuaryMarkerRef.current) map.removeLayer(leafletSanctuaryMarkerRef.current);
    if (leafletTherapistMarkerRef.current) map.removeLayer(leafletTherapistMarkerRef.current);
    if (leafletRoutePolylineRef.current) map.removeLayer(leafletRoutePolylineRef.current);
    if (leafletAccuracyCircleRef.current) map.removeLayer(leafletAccuracyCircleRef.current);

    const sCoords: [number, number] = sanctuaryCoords || [28.4595, 77.0945];
    const tStartCoords: [number, number] = therapistCoords || [sCoords[0] + 0.024, sCoords[1] - 0.018];
    const fullRoutePoints = generateCurvedRoute(tStartCoords, sCoords);

    const sanctuaryIcon = L.divIcon({
      className: 'luxury-marker-sanctuary',
      html: `
        <div class="sanctuary-pin-head">
          <div class="sanctuary-pin-icon">✦</div>
        </div>
        <div class="sanctuary-pin-shadow"></div>
      `,
      iconSize: [32, 40],
      iconAnchor: [16, 36],
      popupAnchor: [0, -36]
    });

    const sanctuaryMarker = L.marker(sCoords, { icon: sanctuaryIcon }).addTo(map);
    sanctuaryMarker.bindPopup(`
      <div style="font-family: var(--font-sans); text-align: left;">
        <div style="font-size: 10px; font-weight: 700; color: var(--accent-gold); letter-spacing: 0.08em; text-transform: uppercase;">
          Sanctuary Destination (${sanctuaryType})
        </div>
        <div style="font-size: 13px; font-weight: 600; color: var(--text-primary); margin-top: 2px;">
          ${sanctuaryAddress}
        </div>
      </div>
    `);
    leafletSanctuaryMarkerRef.current = sanctuaryMarker;

    const accuracyCircle = L.circle(sCoords, {
      radius: Math.max(accuracy * 3, 25),
      color: '#A9812F',
      weight: 1,
      opacity: 0.5,
      fillColor: '#A9812F',
      fillOpacity: 0.08
    }).addTo(map);
    leafletAccuracyCircleRef.current = accuracyCircle;

    const routePolyline = L.polyline(fullRoutePoints, {
      color: '#A9812F',
      weight: 4.5,
      opacity: 0.85,
      dashArray: bookingStatus === 'On the Way' ? '6, 8' : undefined,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);
    leafletRoutePolylineRef.current = routePolyline;

    const pointIdx = Math.min(
      Math.floor(transitProgress * (fullRoutePoints.length - 1)),
      fullRoutePoints.length - 1
    );
    const currentTherapistPos = fullRoutePoints[pointIdx];

    const avatarUrl = therapistPhoto || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80';
    const isArrived = bookingStatus === 'Arrived' || bookingStatus === 'Service Started' || bookingStatus === 'Service Completed';

    const therapistIcon = L.divIcon({
      className: 'luxury-marker-therapist',
      html: `
        ${!isArrived ? '<div class="therapist-radar-wave"></div>' : ''}
        <div class="therapist-avatar-bubble">
          <img src="${avatarUrl}" alt="${therapistName}" />
        </div>
        <div class="therapist-transit-badge">
          ${isArrived ? '✓' : '⚡'}
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });

    const therapistMarker = L.marker(currentTherapistPos, { icon: therapistIcon }).addTo(map);
    leafletTherapistMarkerRef.current = therapistMarker;

    const bounds = L.latLngBounds([sCoords, currentTherapistPos, tStartCoords]);
    map.fitBounds(bounds, { padding: [45, 45], maxZoom: 16 });

  }, [engine, mode, sanctuaryCoords, therapistCoords, therapistName, therapistPhoto, bookingStatus, accuracy, transitProgress]);

  // Leaflet Dispatch Mode
  useEffect(() => {
    if (engine !== 'leaflet') return;
    const map = leafletMapRef.current;
    if (!map || mode !== 'dispatch') return;

    if (leafletDispatchGroupRef.current) map.removeLayer(leafletDispatchGroupRef.current);
    const group = L.layerGroup().addTo(map);
    leafletDispatchGroupRef.current = group;

    const allBoundsPoints: [number, number][] = [];

    bookings.forEach(b => {
      const lat = b.liveLocation?.latitude || 28.4595;
      const lng = b.liveLocation?.longitude || 77.0945;
      allBoundsPoints.push([lat, lng]);

      const bookingIcon = L.divIcon({
        className: 'dispatch-booking-pin',
        html: `<div style="background:#1F1B16; border:2px solid #C28929; color:#FFF; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700;">✦</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
      const marker = L.marker([lat, lng], { icon: bookingIcon }).addTo(group);
      if (onSelectBooking) marker.on('click', () => onSelectBooking(b));
    });

    if (allBoundsPoints.length > 0) {
      map.fitBounds(L.latLngBounds(allBoundsPoints), { padding: [50, 50], maxZoom: 14 });
    }
  }, [engine, mode, bookings, onSelectBooking]);

  // Live Simulated Transit Progression when "On the Way"
  useEffect(() => {
    if (mode !== 'tracking') return;
    if (bookingStatus !== 'On the Way') return;

    const interval = setInterval(() => {
      setTransitProgress(prev => {
        if (prev >= 0.96) return 0.96;
        const next = Math.min(prev + 0.02, 0.96);
        
        const sCoords = sanctuaryCoords || [28.4595, 77.0945];
        const tCoords = therapistCoords || [sCoords[0] + 0.024, sCoords[1] - 0.018];
        const fullDistance = calculateDistanceKm(tCoords, sCoords);
        const remKm = Math.max(fullDistance * (1 - next), 0.2);
        const remEta = Math.max(Math.round(remKm * 4.5), 2);
        
        setCurrentRemainingKm(remKm);
        setCurrentEtaMinutes(remEta);
        if (onProgressUpdate) onProgressUpdate(remKm, remEta);
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [mode, bookingStatus, sanctuaryCoords, therapistCoords, onProgressUpdate]);

  // Recenter handler
  const handleRecenter = useCallback(() => {
    const target = pickerCoords || sanctuaryCoords || [28.4595, 77.0945];

    if (engine === 'google' && googleMapRef.current) {
      googleMapRef.current.panTo({ lat: target[0], lng: target[1] });
      googleMapRef.current.setZoom(15);
    } else if (engine === 'leaflet' && leafletMapRef.current) {
      leafletMapRef.current.setView(target, 15, { animate: true });
    }
  }, [engine, pickerCoords, sanctuaryCoords]);

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    if (engine === 'google' && googleMapRef.current) {
      googleMapRef.current.setZoom((googleMapRef.current.getZoom() || 15) + 1);
    } else if (engine === 'leaflet' && leafletMapRef.current) {
      leafletMapRef.current.zoomIn();
    }
  }, [engine]);

  const handleZoomOut = useCallback(() => {
    if (engine === 'google' && googleMapRef.current) {
      googleMapRef.current.setZoom((googleMapRef.current.getZoom() || 15) - 1);
    } else if (engine === 'leaflet' && leafletMapRef.current) {
      leafletMapRef.current.zoomOut();
    }
  }, [engine]);

  return (
    <div className={`pamwill-map-wrapper ${className}`} style={{ height, position: 'relative', overflow: 'hidden' }}>
      {/* Map Mount Container */}
      <div 
        ref={mapContainerRef} 
        className="pamwill-leaflet-container"
        style={{ width: '100%', height: '100%', backgroundColor: '#FAF8F5' }}
      />

      {/* Detecting loader */}
      {engine === 'detecting' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FAF8F5',
          zIndex: 500
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)' }}>
            <Loader2 size={20} className="animate-spin" />
            <span style={{ fontSize: '12px', fontWeight: 600 }}>Activating Satellite Map...</span>
          </div>
        </div>
      )}

      {/* Floating Controls */}
      {zoomable && (
        <div style={{
          position: 'absolute',
          bottom: '14px',
          right: '14px',
          zIndex: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <button
            type="button"
            onClick={handleRecenter}
            title="Recenter"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid var(--border-hairline)',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              backdropFilter: 'blur(8px)'
            }}
          >
            <Crosshair size={16} color="var(--accent-gold-hover)" />
          </button>

          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom In"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid var(--border-hairline)',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              backdropFilter: 'blur(8px)'
            }}
          >
            <ZoomIn size={15} />
          </button>

          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom Out"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid var(--border-hairline)',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              backdropFilter: 'blur(8px)'
            }}
          >
            <ZoomOut size={15} />
          </button>
        </div>
      )}

      {/* Floating GPS Accuracy & Engine Badge */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        zIndex: 400,
        display: 'flex',
        gap: '6px',
        flexWrap: 'wrap'
      }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(8px)',
          padding: '4px 10px',
          borderRadius: 'var(--radius-pill)',
          border: '1px solid var(--border-hairline)',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          fontSize: '10px',
          fontWeight: 700,
          color: engine === 'google' ? '#1A73E8' : 'var(--accent-gold)',
          boxShadow: 'var(--shadow-subtle)'
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: engine === 'google' ? '#1A73E8' : '#2E7D32',
            display: 'inline-block'
          }} />
          {engine === 'google' ? 'Google Maps Platform Active' : 'Satellite GPS Active'}
        </div>

        {serviceRadiusKm && (
          <div style={{
            backgroundColor: 'rgba(169, 129, 47, 0.95)',
            backdropFilter: 'blur(8px)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid #FFFFFF',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '10px',
            fontWeight: 800,
            color: '#FFFFFF',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}>
            <span>📍 {serviceRadiusKm} km Service Perimeter</span>
          </div>
        )}

        {mode === 'tracking' && (
          <div style={{
            backgroundColor: 'rgba(31, 27, 22, 0.9)',
            backdropFilter: 'blur(8px)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--accent-gold)',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '10px',
            fontWeight: 700,
            color: 'var(--accent-gold-light)'
          }}>
            <Navigation size={10} color="var(--accent-gold)" />
            {bookingStatus === 'On the Way' ? `${currentRemainingKm.toFixed(1)} km away` : bookingStatus}
          </div>
        )}
      </div>

      {/* Picker Mode Place Autocomplete / Search Overlay */}
      {mode === 'picker' && (
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          right: '60px',
          zIndex: 400,
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(10px)',
          padding: '6px 10px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-hairline)',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {isGeocoding ? (
            <Loader2 size={13} className="animate-spin" color="var(--accent-gold)" />
          ) : (
            <MapPin size={13} color="var(--accent-gold-hover)" />
          )}
          <span style={{
            fontSize: '11px',
            color: 'var(--text-primary)',
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {isGeocoding ? 'Detecting street & building...' : detectedAddress || 'Drag gold pin to set doorway'}
          </span>
        </div>
      )}
    </div>
  );
};

export default PamwillMap;

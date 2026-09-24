import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { 
  Navigation, Crosshair, ZoomIn, ZoomOut, Compass, MapPin, 
  Sparkles, CheckCircle2, ShieldAlert, Phone
} from 'lucide-react';
import { Booking, BookingStatus, Therapist } from '../../types';

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

// Generate intermediate route waypoints for realistic road curved route
function generateCurvedRoute(start: [number, number], end: [number, number]): [number, number][] {
  const [lat1, lng1] = start;
  const [lat2, lng2] = end;
  
  const midLat = (lat1 + lat2) / 2;
  const midLng = (lng1 + lng2) / 2;
  
  // Slight perpendicular offset to simulate natural roads and arterial avenues
  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;
  const offsetLat = midLat + dLng * 0.18;
  const offsetLng = midLng - dLat * 0.18;
  
  const points: [number, number][] = [];
  const steps = 30;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Quadratic Bezier interpolation
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
  bookings = [],
  therapists = [],
  onSelectBooking,
  selectedCityCoords,
  zoomable = true,
  interactive = true,
  className = ''
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  
  // Layer references for dynamic updates
  const therapistMarkerRef = useRef<L.Marker | null>(null);
  const sanctuaryMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  const pickerMarkerRef = useRef<L.Marker | null>(null);
  const dispatchLayerGroupRef = useRef<L.LayerGroup | null>(null);
  
  // Dynamic animated progress (0.0 to 1.0)
  const [transitProgress, setTransitProgress] = useState<number>(() => {
    if (bookingStatus === 'Arrived' || bookingStatus === 'Service Started' || bookingStatus === 'Service Completed') {
      return 1.0;
    }
    return 0.35; // default 35% on the way
  });
  
  const [currentEtaMinutes, setCurrentEtaMinutes] = useState<number>(12);
  const [currentRemainingKm, setCurrentRemainingKm] = useState<number>(2.4);

  // Fallback coords for India cities
  const centerFallback: [number, number] = selectedCityCoords || sanctuaryCoords || [28.4595, 77.0945];

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: centerFallback,
      zoom: mode === 'dispatch' ? 12 : 14,
      zoomControl: false, // We provide bespoke luxury gold controls
      attributionControl: false,
      scrollWheelZoom: interactive,
      dragging: interactive,
      touchZoom: interactive,
      doubleClickZoom: interactive,
    });

    // CartoDB Voyager luxury tile layer
    const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    });
    tileLayer.addTo(map);

    mapRef.current = map;

    // Force size invalidation in next tick for reliable rendering inside flex/modals
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update map size when container is resized
  useEffect(() => {
    if (!mapRef.current) return;
    const handleResize = () => {
      mapRef.current?.invalidateSize();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // MODE: TRACKING or PREVIEW
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (mode !== 'tracking' && mode !== 'preview') return;

    // Remove existing layers
    if (sanctuaryMarkerRef.current) map.removeLayer(sanctuaryMarkerRef.current);
    if (therapistMarkerRef.current) map.removeLayer(therapistMarkerRef.current);
    if (routePolylineRef.current) map.removeLayer(routePolylineRef.current);
    if (accuracyCircleRef.current) map.removeLayer(accuracyCircleRef.current);

    const sCoords: [number, number] = sanctuaryCoords || [28.4595, 77.0945];
    const tStartCoords: [number, number] = therapistCoords || [sCoords[0] + 0.024, sCoords[1] - 0.018];

    // Generate curved road route
    const fullRoutePoints = generateCurvedRoute(tStartCoords, sCoords);

    // Add sanctuary marker (Bespoke Obsidian & Gold Pin)
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
        <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">
          GPS Precision: ±${accuracy}m
        </div>
      </div>
    `);
    sanctuaryMarkerRef.current = sanctuaryMarker;

    // Accuracy Circle around Sanctuary
    const accuracyCircle = L.circle(sCoords, {
      radius: Math.max(accuracy * 3, 25),
      color: '#A9812F',
      weight: 1,
      opacity: 0.5,
      fillColor: '#A9812F',
      fillOpacity: 0.08
    }).addTo(map);
    accuracyCircleRef.current = accuracyCircle;

    // Route Polyline (Gold route line with subtle shadow)
    const routePolyline = L.polyline(fullRoutePoints, {
      color: '#A9812F',
      weight: 4.5,
      opacity: 0.85,
      dashArray: bookingStatus === 'On the Way' ? '6, 8' : undefined,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);
    routePolylineRef.current = routePolyline;

    // Calculate dynamic position based on transitProgress
    const pointIdx = Math.min(
      Math.floor(transitProgress * (fullRoutePoints.length - 1)),
      fullRoutePoints.length - 1
    );
    const currentTherapistPos = fullRoutePoints[pointIdx];

    // Add Therapist Marker
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
      iconAnchor: [22, 22],
      popupAnchor: [0, -22]
    });

    const therapistMarker = L.marker(currentTherapistPos, { icon: therapistIcon }).addTo(map);
    therapistMarker.bindPopup(`
      <div style="font-family: var(--font-sans); text-align: left; min-width: 140px;">
        <div style="font-size: 10px; font-weight: 700; color: var(--accent-gold); text-transform: uppercase;">
          ${isArrived ? 'Practitioner Arrived' : 'En Route to Sanctuary'}
        </div>
        <div style="font-size: 13px; font-weight: 700; margin-top: 2px;">${therapistName}</div>
        <div style="font-size: 11px; color: var(--text-secondary);">★ ${therapistRating} • Luxury Practitioner</div>
        <div style="font-size: 11px; font-weight: 600; color: var(--accent-gold-hover); margin-top: 4px;">
          ${isArrived ? 'At Entrance' : `ETA: ~${currentEtaMinutes} mins (${currentRemainingKm.toFixed(1)} km)`}
        </div>
      </div>
    `);
    therapistMarkerRef.current = therapistMarker;

    // Fit bounds gracefully to contain both points
    const bounds = L.latLngBounds([sCoords, currentTherapistPos, tStartCoords]);
    map.fitBounds(bounds, {
      padding: [45, 45],
      maxZoom: 16
    });

  }, [mode, sanctuaryCoords, therapistCoords, therapistName, therapistPhoto, therapistRating, bookingStatus, accuracy, transitProgress]);

  // Live Simulated Transit Progression when "On the Way"
  useEffect(() => {
    if (mode !== 'tracking') return;
    if (bookingStatus !== 'On the Way') return;

    const interval = setInterval(() => {
      setTransitProgress(prev => {
        if (prev >= 0.96) {
          return 0.96; // keep near arrival until status officially switches to Arrived
        }
        const next = Math.min(prev + 0.02, 0.96);
        
        // Recalculate remaining km and ETA
        const sCoords = sanctuaryCoords || [28.4595, 77.0945];
        const tCoords = therapistCoords || [sCoords[0] + 0.024, sCoords[1] - 0.018];
        const fullDistance = calculateDistanceKm(tCoords, sCoords);
        const remKm = Math.max(fullDistance * (1 - next), 0.2);
        const remEta = Math.max(Math.round(remKm * 4.5), 2);
        
        setCurrentRemainingKm(remKm);
        setCurrentEtaMinutes(remEta);
        if (onProgressUpdate) {
          onProgressUpdate(remKm, remEta);
        }
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [mode, bookingStatus, sanctuaryCoords, therapistCoords, onProgressUpdate]);

  // MODE: PICKER
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (mode !== 'picker') return;

    if (pickerMarkerRef.current) map.removeLayer(pickerMarkerRef.current);
    if (accuracyCircleRef.current) map.removeLayer(accuracyCircleRef.current);

    const initial = pickerCoords || sanctuaryCoords || [28.4595, 77.0945];

    // Draggable Luxury Pin
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

    pickerMarkerRef.current = marker;

    const circle = L.circle(initial, {
      radius: Math.max(accuracy * 2.5, 30),
      color: '#A9812F',
      weight: 1.5,
      fillColor: '#A9812F',
      fillOpacity: 0.12
    }).addTo(map);
    accuracyCircleRef.current = circle;

    map.setView(initial, 15);

    // Event on drag end
    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      circle.setLatLng(pos);
      if (onPickerChange) {
        onPickerChange({
          latitude: Number(pos.lat.toFixed(6)),
          longitude: Number(pos.lng.toFixed(6)),
          placeName: `Sanctuary Pin (${pos.lat.toFixed(4)}° N, ${pos.lng.toFixed(4)}° E)`
        });
      }
    });

    // Event on map click
    map.on('click', (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      circle.setLatLng(e.latlng);
      if (onPickerChange) {
        onPickerChange({
          latitude: Number(e.latlng.lat.toFixed(6)),
          longitude: Number(e.latlng.lng.toFixed(6)),
          placeName: `Sanctuary Pin (${e.latlng.lat.toFixed(4)}° N, ${e.latlng.lng.toFixed(4)}° E)`
        });
      }
    });

    return () => {
      map.off('click');
    };
  }, [mode, pickerCoords, accuracy, onPickerChange]);

  // MODE: DISPATCH (Admin Fleet Overview)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (mode !== 'dispatch') return;

    if (dispatchLayerGroupRef.current) {
      map.removeLayer(dispatchLayerGroupRef.current);
    }

    const group = L.layerGroup().addTo(map);
    dispatchLayerGroupRef.current = group;

    const allBoundsPoints: [number, number][] = [];

    // Plot Active Bookings
    bookings.forEach(booking => {
      const lat = booking.liveLocation?.latitude || 28.4595;
      const lng = booking.liveLocation?.longitude || 77.0945;
      allBoundsPoints.push([lat, lng]);

      const statusColor = 
        booking.status === 'On the Way' ? '#C28929' :
        booking.status === 'Arrived' || booking.status === 'Service Started' ? '#4C6B4F' :
        booking.status === 'Cancelled' ? '#8C3A2B' : '#6B6259';

      const bookingIcon = L.divIcon({
        className: 'dispatch-booking-pin',
        html: `
          <div style="
            background: #1F1B16;
            border: 2px solid ${statusColor};
            color: #FFFFFF;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: 700;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          ">
            ✦
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([lat, lng], { icon: bookingIcon }).addTo(group);
      marker.bindPopup(`
        <div style="font-family: var(--font-sans); min-width: 170px;">
          <div style="font-size: 10px; font-weight: 700; color: ${statusColor}; text-transform: uppercase;">
            ${booking.status}
          </div>
          <div style="font-size: 13px; font-weight: 700; margin-top: 2px;">#${booking.id} • ${booking.service.name}</div>
          <div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">
            Patron: <strong>${booking.customerName}</strong>
          </div>
          <div style="font-size: 11px; color: var(--text-secondary);">
            Therapist: <strong>${booking.therapistName || 'Unassigned'}</strong>
          </div>
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">
            📍 ${booking.address}
          </div>
        </div>
      `);

      if (onSelectBooking) {
        marker.on('click', () => onSelectBooking(booking));
      }
    });

    // Plot Online Therapists
    therapists.forEach(therapist => {
      if (!therapist.currentLocation) return;
      const lat = therapist.currentLocation.latitude;
      const lng = therapist.currentLocation.longitude;
      allBoundsPoints.push([lat, lng]);

      const therIcon = L.divIcon({
        className: 'dispatch-therapist-pin',
        html: `
          <div style="
            position: relative;
            width: 34px;
            height: 34px;
            border-radius: 50%;
            border: 2px solid ${therapist.isOnline ? '#4C6B4F' : '#9A8F82'};
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            background: #fff;
          ">
            <img src="${therapist.photoUrl}" style="width: 100%; height: 100%; object-fit: cover;" alt="${therapist.fullName}" />
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const marker = L.marker([lat, lng], { icon: therIcon }).addTo(group);
      marker.bindPopup(`
        <div style="font-family: var(--font-sans); min-width: 150px;">
          <div style="font-size: 10px; font-weight: 700; color: ${therapist.isOnline ? 'var(--status-success)' : 'var(--text-muted)'}; text-transform: uppercase;">
            ${therapist.isOnline ? '● Online & Available' : '○ Offline'}
          </div>
          <div style="font-size: 13px; font-weight: 700; margin-top: 2px;">${therapist.fullName}</div>
          <div style="font-size: 11px; color: var(--text-secondary);">★ ${therapist.rating} • ${therapist.completedJobs} Sessions</div>
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">
            Area: ${therapist.currentLocation.area}
          </div>
        </div>
      `);
    });

    if (allBoundsPoints.length > 0) {
      map.fitBounds(L.latLngBounds(allBoundsPoints), {
        padding: [50, 50],
        maxZoom: 14
      });
    }

  }, [mode, bookings, therapists, onSelectBooking]);

  // Recenter map handler
  const handleRecenter = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    if (mode === 'tracking' || mode === 'preview') {
      const sCoords = sanctuaryCoords || [28.4595, 77.0945];
      const tCoords = therapistCoords || [sCoords[0] + 0.024, sCoords[1] - 0.018];
      map.fitBounds(L.latLngBounds([sCoords, tCoords]), {
        padding: [45, 45],
        maxZoom: 16
      });
    } else if (mode === 'picker') {
      const target = pickerCoords || sanctuaryCoords || [28.4595, 77.0945];
      map.setView(target, 15, { animate: true });
    }
  }, [mode, sanctuaryCoords, therapistCoords, pickerCoords]);

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    mapRef.current?.zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    mapRef.current?.zoomOut();
  }, []);

  return (
    <div className={`pamwill-map-wrapper ${className}`} style={{ height }}>
      {/* Leaflet Mount Container */}
      <div ref={mapContainerRef} className="pamwill-leaflet-container" />

      {/* Floating Luxury Map Controls */}
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
          {/* Recenter button */}
          <button
            type="button"
            onClick={handleRecenter}
            title="Recenter Sanctuary & Route"
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
              backdropFilter: 'blur(8px)',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--accent-gold-light)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)')}
          >
            <Crosshair size={16} color="var(--accent-gold-hover)" />
          </button>

          {/* Zoom In */}
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

          {/* Zoom Out */}
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

      {/* Floating GPS Accuracy & Status Badge (Tracking Mode) */}
      {mode === 'tracking' && (
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
            padding: '5px 10px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--status-success)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--status-success)',
            boxShadow: 'var(--shadow-subtle)'
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--status-success)', display: 'inline-block' }} />
            Live Satellite GPS (±{accuracy}m)
          </div>

          <div style={{
            backgroundColor: 'rgba(31, 27, 22, 0.88)',
            backdropFilter: 'blur(8px)',
            padding: '5px 10px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--accent-gold)',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--accent-gold-light)',
            boxShadow: 'var(--shadow-subtle)'
          }}>
            <Navigation size={11} color="var(--accent-gold)" />
            {bookingStatus === 'On the Way' ? `${currentRemainingKm.toFixed(1)} km away` : bookingStatus}
          </div>
        </div>
      )}

      {/* Picker Mode Top Floating Advice */}
      {mode === 'picker' && (
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          right: '12px',
          zIndex: 400,
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(8px)',
          padding: '6px 12px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-hairline)',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} color="var(--accent-gold-hover)" />
            <span style={{ fontSize: '11px', color: 'var(--text-primary)', fontWeight: 600 }}>
              Tap map or drag gold pin to exact gate / villa entrance
            </span>
          </div>
          {onLocateMe && (
            <button
              type="button"
              onClick={onLocateMe}
              disabled={isLocating}
              style={{
                backgroundColor: 'var(--accent-gold-light)',
                border: '1px solid var(--accent-gold)',
                color: 'var(--accent-gold-hover)',
                borderRadius: 'var(--radius-sm)',
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                whiteSpace: 'nowrap'
              }}
            >
              <Navigation size={10} />
              {isLocating ? 'Locating...' : 'My GPS'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PamwillMap;

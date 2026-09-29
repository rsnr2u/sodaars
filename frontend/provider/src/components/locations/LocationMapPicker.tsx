import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation } from 'lucide-react';
import Button from '../ui/Button';

// Fix Leaflet's default marker icon paths in bundled environments
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export interface LocationMapPickerProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
  height?: string;
  readOnly?: boolean;
}

export const LocationMapPicker: React.FC<LocationMapPickerProps> = ({
  latitude,
  longitude,
  onChange,
  height = '300px',
  readOnly = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Default coordinate center (India center if no coordinates provided)
  const defaultLat = latitude ?? 17.385;
  const defaultLng = longitude ?? 78.4867;

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Initialize Leaflet map
    const map = L.map(mapContainerRef.current, {
      center: [defaultLat, defaultLng],
      zoom: latitude && longitude ? 15 : 6,
      zoomControl: true,
    });

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // If initial coordinates exist, place marker
    if (latitude !== null && longitude !== null) {
      const marker = L.marker([latitude, longitude], {
        draggable: !readOnly,
      }).addTo(map);

      if (!readOnly) {
        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          onChange(parseFloat(pos.lat.toFixed(7)), parseFloat(pos.lng.toFixed(7)));
        });
      }
      markerRef.current = marker;
    }

    // Click on map to place or move marker
    if (!readOnly) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        const cleanLat = parseFloat(lat.toFixed(7));
        const cleanLng = parseFloat(lng.toFixed(7));

        if (markerRef.current) {
          markerRef.current.setLatLng([cleanLat, cleanLng]);
        } else {
          const marker = L.marker([cleanLat, cleanLng], { draggable: true }).addTo(map);
          marker.on('dragend', () => {
            const pos = marker.getLatLng();
            onChange(parseFloat(pos.lat.toFixed(7)), parseFloat(pos.lng.toFixed(7)));
          });
          markerRef.current = marker;
        }

        onChange(cleanLat, cleanLng);
      });
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Sync marker position when external latitude/longitude props change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (latitude !== null && longitude !== null) {
      if (markerRef.current) {
        markerRef.current.setLatLng([latitude, longitude]);
      } else {
        const marker = L.marker([latitude, longitude], { draggable: !readOnly }).addTo(mapInstanceRef.current);
        if (!readOnly) {
          marker.on('dragend', () => {
            const pos = marker.getLatLng();
            onChange(parseFloat(pos.lat.toFixed(7)), parseFloat(pos.lng.toFixed(7)));
          });
        }
        markerRef.current = marker;
      }
      mapInstanceRef.current.setView([latitude, longitude], 15);
    } else if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
  }, [latitude, longitude, readOnly]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = parseFloat(position.coords.latitude.toFixed(7));
        const lng = parseFloat(position.coords.longitude.toFixed(7));
        onChange(lat, lng);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([lat, lng], 16);
        }
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      },
      { timeout: 10000 }
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <MapPin size={15} style={{ color: 'var(--blue-600)' }} />
          <span>Interactive Map Pin</span>
        </span>
        {!readOnly && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleUseCurrentLocation}
            isLoading={isLocating}
            leftIcon={<Navigation size={13} />}
          >
            Use My Location
          </Button>
        )}
      </div>

      <div
        ref={mapContainerRef}
        style={{
          height,
          width: '100%',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden',
          zIndex: 1,
        }}
      />
      {!readOnly && (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Click anywhere on the map or drag the pin to set site coordinates.
        </span>
      )}
    </div>
  );
};

export default LocationMapPicker;

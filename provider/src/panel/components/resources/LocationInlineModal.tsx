import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Info,
  Navigation,
  Compass,
} from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { LocationMetadata } from '../../types/resource';

export interface LocationInlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (location: LocationMetadata) => void;
  initialLocation?: LocationMetadata | null;
}

export const LocationInlineModal: React.FC<LocationInlineModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialLocation,
}) => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [zoomLevel, setZoomLevel] = useState(15);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialLocation) {
      setName(initialLocation.name);
      setCity(initialLocation.city);
      setArea(initialLocation.area);
      setLandmark(initialLocation.landmark || '');
      setLatitude(initialLocation.latitude || '');
      setLongitude(initialLocation.longitude || '');
    } else {
      setName('');
      setCity('');
      setArea('');
      setLandmark('');
      setLatitude('');
      setLongitude('');
    }
    setError(null);
  }, [initialLocation, isOpen]);

  const parsedLat = parseFloat(latitude);
  const parsedLng = parseFloat(longitude);
  const hasValidCoords = !isNaN(parsedLat) && !isNaN(parsedLng);
  const displayLat = hasValidCoords ? parsedLat : 16.5062;
  const displayLng = hasValidCoords ? parsedLng : 80.6480;

  // Compute bounding box for OpenStreetMap embed
  const delta = 0.008 * (16 / Math.max(zoomLevel, 10));
  const bbox = `${displayLng - delta},${displayLat - delta},${displayLng + delta},${displayLat + delta}`;
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
    bbox
  )}&layer=mapnik&marker=${displayLat}%2C${displayLng}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Site Name is required');
      return;
    }
    if (!city.trim()) {
      setError('City is required');
      return;
    }

    const newLoc: LocationMetadata = {
      id: initialLocation?.id || `loc-${Date.now()}`,
      name: name.trim(),
      city: city.trim(),
      area: area.trim() || city.trim(),
      landmark: landmark.trim() || undefined,
      latitude: latitude.trim() || undefined,
      longitude: longitude.trim() || undefined,
    };

    onSave(newLoc);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-orange-50 text-[#EA580C] flex items-center justify-center">
            <MapPin size={16} />
          </div>
          <span>{initialLocation ? 'Edit Physical Location' : 'Add Physical Location'}</span>
        </div>
      }
      maxWidth="max-w-xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-[11px] font-mono text-[#737373]">
            OpenStreetMap GIS Coordinates Anchor
          </span>
          <div className="flex items-center gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" variant="primary" size="sm" onClick={handleSubmit}>
              Save Location
            </Button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Supporting Architecture Notice */}
        <div className="p-3 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] flex items-start gap-2.5">
          <Info size={15} className="text-[#EA580C] shrink-0 mt-0.5" />
          <p className="text-xs text-[#525252] leading-relaxed">
            <strong className="text-[#171717]">Location Architecture:</strong> Physical sites host one or more static advertising assets (hoardings, unipoles, gantries). Locations are supporting metadata and are not a separate primary navigation.
          </p>
        </div>

        {error && (
          <div className="p-2.5 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        {/* ========================================================================= */}
        {/* OpenStreetMap Visual Map & Location Picker UI                             */}
        {/* ========================================================================= */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#171717]">
              <Compass size={14} className="text-[#EA580C]" />
              <span>OpenStreetMap Site Locator</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(z + 1, 18))}
                className="w-6 h-6 rounded bg-[#F5F5F4] hover:bg-[#E5E5E5] text-[#171717] font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
                title="Zoom in map"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(z - 1, 11))}
                className="w-6 h-6 rounded bg-[#F5F5F4] hover:bg-[#E5E5E5] text-[#171717] font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
                title="Zoom out map"
              >
                −
              </button>
            </div>
          </div>

          {/* Map Viewport Container */}
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-[#E5E5E5] bg-[#FAFAF9] shadow-inner group">
            {/* Live OpenStreetMap Iframe Embed */}
            <iframe
              title="OpenStreetMap Location Viewer"
              src={osmEmbedUrl}
              className="w-full h-full border-0 pointer-events-auto"
              loading="lazy"
            />

            {/* Coordinate Overlay Badge */}
            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-[#171717]/85 text-white text-[10px] font-mono flex items-center gap-1.5 backdrop-blur-xs">
              <span className={`w-1.5 h-1.5 rounded-full ${hasValidCoords ? 'bg-[#EA580C]' : 'bg-stone-400'}`} />
              <span>
                {hasValidCoords
                  ? `${displayLat.toFixed(4)}° N, ${displayLng.toFixed(4)}° E`
                  : 'Coordinates pending — specify below'}
              </span>
            </div>

            {/* Attribution */}
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-white/90 text-[#737373] text-[9px] font-mono border border-[#E5E5E5] backdrop-blur-xs">
              © OpenStreetMap
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Core Location Metadata Form Fields                                        */}
        {/* ========================================================================= */}
        <div>
          <label className="block text-xs font-semibold text-[#171717] mb-1">
            Site / Location Name <span className="text-rose-500">*</span>
          </label>
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. South Junction Display Site"
            className="w-full text-xs"
            autoFocus
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#171717] mb-1">
              City / Town <span className="text-rose-500">*</span>
            </label>
            <Input
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. Vijayawada"
              className="w-full text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#171717] mb-1">
              Area / Locality
            </label>
            <Input
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g. Ring Road Corridor"
              className="w-full text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#171717] mb-1">
            Prominent Landmark
          </label>
          <Input
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            placeholder="e.g. Adjacent to Flyover Pillar 24"
            className="w-full text-xs"
          />
        </div>

        {/* Latitude & Longitude UI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs font-semibold text-[#171717] mb-1">
              Latitude (GIS)
            </label>
            <div className="relative">
              <Input
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="e.g. 16.5062"
                className="w-full text-xs pl-8 font-mono"
              />
              <Navigation size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#737373]" />
            </div>
            <span className="text-[10px] text-[#737373] mt-0.5 block">
              Format: Decimal degrees
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#171717] mb-1">
              Longitude (GIS)
            </label>
            <div className="relative">
              <Input
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="e.g. 80.6480"
                className="w-full text-xs pl-8 font-mono"
              />
              <Navigation size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#737373]" />
            </div>
            <span className="text-[10px] text-[#737373] mt-0.5 block">
              Format: Decimal degrees
            </span>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default LocationInlineModal;

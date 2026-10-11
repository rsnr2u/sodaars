import React, { useState, useEffect } from 'react';
import {
  Layers,
  MapPin,
  Plus,
  Info,
  DollarSign,
  Maximize2,
  Compass,
  Sun,
  Eye,
  Image as ImageIcon,
} from 'lucide-react';
import Drawer from '../../../components/ui/Drawer';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import {
  AdvertisingResource,
  StaticResourceType,
  ResourceStatus,
  IlluminationType,
  LocationMetadata,
  APPROVED_RESOURCE_TYPES,
  APPROVED_ILLUMINATION_TYPES,
} from '../../types/resource';
import LocationInlineModal from './LocationInlineModal';

export interface ResourceFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (resource: AdvertisingResource) => void;
  initialResource?: AdvertisingResource | null;
  savedLocations: LocationMetadata[];
  onAddNewLocation: (location: LocationMetadata) => void;
}

export const ResourceFormDrawer: React.FC<ResourceFormDrawerProps> = ({
  isOpen,
  onClose,
  onSave,
  initialResource,
  savedLocations,
  onAddNewLocation,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<StaticResourceType>('Hoardings');
  const [selectedLocationId, setSelectedLocationId] = useState<string>('');
  const [widthFt, setWidthFt] = useState<string>('');
  const [heightFt, setHeightFt] = useState<string>('');
  const [orientation, setOrientation] = useState('Facing Traffic');
  const [illumination, setIllumination] = useState<IlluminationType>('Front-lit');
  const [visibilityFacing, setVisibilityFacing] = useState('Left Hand Side (LHS)');
  const [customerPrice, setCustomerPrice] = useState<string>('');
  const [sodaarsPrice, setSodaarsPrice] = useState<string>('');
  const [marketplaceParticipation, setMarketplaceParticipation] = useState(true);
  const [status, setStatus] = useState<ResourceStatus>('Active');
  const [mediaUrl, setMediaUrl] = useState('');
  const [description, setDescription] = useState('');

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialResource) {
      setName(initialResource.name);
      setType(initialResource.type);
      setSelectedLocationId(initialResource.location.id);
      setWidthFt(initialResource.widthFt.toString());
      setHeightFt(initialResource.heightFt.toString());
      setOrientation(initialResource.orientation);
      setIllumination(initialResource.illumination);
      setVisibilityFacing(initialResource.visibilityFacing);
      setCustomerPrice(initialResource.customerPrice !== null ? initialResource.customerPrice.toString() : '');
      setSodaarsPrice(initialResource.sodaarsPrice !== null ? initialResource.sodaarsPrice.toString() : '');
      setMarketplaceParticipation(initialResource.marketplaceParticipation);
      setStatus(initialResource.status);
      setMediaUrl(initialResource.mediaUrl || '');
      setDescription(initialResource.description || '');
    } else {
      // Default clean state
      setName('');
      setType('Hoardings');
      setSelectedLocationId(savedLocations[0]?.id || '');
      setWidthFt('20');
      setHeightFt('10');
      setOrientation('Facing Traffic');
      setIllumination('Front-lit');
      setVisibilityFacing('Left Hand Side (LHS)');
      setCustomerPrice('');
      setSodaarsPrice('');
      setMarketplaceParticipation(true);
      setStatus('Active');
      setMediaUrl('');
      setDescription('');
    }
    setError(null);
  }, [initialResource, isOpen, savedLocations]);

  // Calculate Total Area
  const w = parseFloat(widthFt) || 0;
  const h = parseFloat(heightFt) || 0;
  const totalSqFt = Math.round(w * h);

  const selectedLocation = savedLocations.find((l) => l.id === selectedLocationId);

  const handleLocationCreated = (newLoc: LocationMetadata) => {
    onAddNewLocation(newLoc);
    setSelectedLocationId(newLoc.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Resource Name is required');
      return;
    }
    if (!selectedLocation) {
      setError('Please select or create a physical location for this resource');
      return;
    }
    if (w <= 0 || h <= 0) {
      setError('Width and Height must be greater than 0');
      return;
    }

    const cPrice = customerPrice.trim() ? parseFloat(customerPrice) : null;
    const sPrice = sodaarsPrice.trim() ? parseFloat(sodaarsPrice) : null;

    const resourcePayload: AdvertisingResource = {
      id: initialResource?.id || `res-${Date.now()}`,
      name: name.trim(),
      type,
      location: selectedLocation,
      widthFt: w,
      heightFt: h,
      totalSqFt,
      orientation: orientation.trim() || 'Facing Traffic',
      illumination,
      visibilityFacing: visibilityFacing.trim() || 'Direct Facing',
      customerPrice: cPrice,
      sodaarsPrice: sPrice,
      marketplaceParticipation,
      status,
      mediaUrl: mediaUrl.trim() || undefined,
      description: description.trim() || undefined,
      createdAt: initialResource?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(resourcePayload);
    onClose();
  };

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        title={
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-orange-50 text-[#EA580C] flex items-center justify-center">
              <Layers size={16} />
            </div>
            <span>
              {initialResource ? 'Edit Inventory Item' : 'Add Inventory'}
            </span>
          </div>
        }
        width="max-w-2xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] text-[#737373]">
              Static OOH Resource • Quota: Active + Inactive
            </span>
            <div className="flex items-center gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button type="button" variant="primary" size="sm" onClick={handleSubmit}>
                {initialResource ? 'Save Changes' : 'Add Inventory'}
              </Button>
            </div>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          {/* Section 1: Core Identity */}
          <div className="space-y-4">
            <div className="border-b border-[#E5E5E5] pb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#737373]">
                1. Resource Identity &amp; Type
              </h4>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">
                Resource Name <span className="text-rose-500">*</span>
              </label>
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g. Benz Circle Flyover South Unipole Face A"
                className="w-full text-xs"
              />
              <span className="text-[11px] text-[#737373] mt-0.5 block">
                Give this physical advertising face a descriptive, easily identifiable operational title.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Static Resource Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as StaticResourceType)}
                  className="w-full text-xs h-9 px-3 rounded-md bg-white border border-[#E5E5E5] text-[#171717] focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C]"
                >
                  {APPROVED_RESOURCE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-[#737373] mt-0.5 block">
                  Static physical format only (No digital/DOOH).
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Operational Status <span className="text-rose-500">*</span>
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ResourceStatus)}
                  className="w-full text-xs h-9 px-3 rounded-md bg-white border border-[#E5E5E5] text-[#171717] focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C]"
                >
                  <option value="Active">Active (Operational)</option>
                  <option value="Inactive">Inactive (Temporarily dormant)</option>
                  <option value="Archived">Archived (Decommissioned)</option>
                </select>
                <span className="text-[11px] text-[#737373] mt-0.5 block">
                  Quota counts Active + Inactive.
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Location (Supporting Metadata) */}
          <div className="space-y-4">
            <div className="border-b border-[#E5E5E5] pb-2 flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#737373]">
                2. Location (Supporting Metadata)
              </h4>
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(true)}
                className="text-xs font-semibold text-[#EA580C] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus size={13} />
                <span>Add New Location</span>
              </button>
            </div>

            {savedLocations.length === 0 ? (
              <div className="p-4 rounded-lg bg-[#FAFAF9] border border-dashed border-[#E5E5E5] text-center">
                <p className="text-xs text-[#525252] mb-2">
                  No physical locations defined yet. Locations host one or more advertising assets.
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  leftIcon={<Plus size={13} />}
                  onClick={() => setIsLocationModalOpen(true)}
                >
                  Create Physical Location
                </Button>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Select Physical Site / Location <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedLocationId}
                  onChange={(e) => setSelectedLocationId(e.target.value)}
                  className="w-full text-xs h-9 px-3 rounded-md bg-white border border-[#E5E5E5] text-[#171717] focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C]"
                >
                  <option value="" disabled>
                    -- Choose physical location --
                  </option>
                  {savedLocations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.city})
                    </option>
                  ))}
                </select>

                {selectedLocation && (
                  <div className="mt-2.5 p-3 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] text-xs text-[#525252] flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <MapPin size={15} className="text-[#EA580C] shrink-0 mt-0.5" />
                        <div className="leading-snug">
                          <span className="font-semibold text-[#171717]">{selectedLocation.name}</span>
                          <span className="text-[#737373]"> • {selectedLocation.city}, {selectedLocation.area}</span>
                          {selectedLocation.landmark && (
                            <div className="text-[11px] text-[#737373] mt-0.5">
                              Landmark: {selectedLocation.landmark}
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsLocationModalOpen(true)}
                        className="text-[11px] font-semibold text-[#EA580C] hover:underline shrink-0 cursor-pointer"
                      >
                        Edit on Map
                      </button>
                    </div>

                    {selectedLocation.latitude && selectedLocation.longitude && (
                      <div className="flex items-center gap-2 pt-1.5 border-t border-[#E5E5E5] text-[11px] text-[#737373]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="font-mono text-[#171717]">
                          OpenStreetMap: {selectedLocation.latitude}° N, {selectedLocation.longitude}° E
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 3: Physical Dimensions & Orientation */}
          <div className="space-y-4">
            <div className="border-b border-[#E5E5E5] pb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#737373]">
                3. Physical Dimensions &amp; Specifications
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Width (ft) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    min="1"
                    step="0.1"
                    value={widthFt}
                    onChange={(e) => setWidthFt(e.target.value)}
                    placeholder="20"
                    className="w-full text-xs pl-8 font-mono"
                  />
                  <Maximize2 size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#737373]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Height (ft) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    min="1"
                    step="0.1"
                    value={heightFt}
                    onChange={(e) => setHeightFt(e.target.value)}
                    placeholder="10"
                    className="w-full text-xs pl-8 font-mono"
                  />
                  <Maximize2 size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#737373]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Total Area (Sq.Ft.)
                </label>
                <div className="h-9 px-3 rounded-md bg-[#FAFAF9] border border-[#E5E5E5] flex items-center font-mono font-bold text-xs text-[#171717]">
                  {totalSqFt > 0 ? `${totalSqFt} sq.ft` : '—'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Orientation
                </label>
                <div className="relative">
                  <Input
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value)}
                    placeholder="e.g. Facing Traffic / North"
                    className="w-full text-xs pl-8"
                  />
                  <Compass size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#737373]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Illumination
                </label>
                <div className="relative">
                  <select
                    value={illumination}
                    onChange={(e) => setIllumination(e.target.value as IlluminationType)}
                    className="w-full text-xs h-9 pl-8 pr-3 rounded-md bg-white border border-[#E5E5E5] text-[#171717] focus:outline-none focus:border-[#EA580C]"
                  >
                    {APPROVED_ILLUMINATION_TYPES.map((il) => (
                      <option key={il} value={il}>
                        {il}
                      </option>
                    ))}
                  </select>
                  <Sun size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#737373]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Visibility / Facing
                </label>
                <div className="relative">
                  <Input
                    value={visibilityFacing}
                    onChange={(e) => setVisibilityFacing(e.target.value)}
                    placeholder="e.g. LHS / RHS / Overhead"
                    className="w-full text-xs pl-8"
                  />
                  <Eye size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#737373]" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Pricing */}
          <div className="space-y-4">
            <div className="border-b border-[#E5E5E5] pb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#737373]">
                4. Resource Pricing Structure
              </h4>
            </div>

            <div className="p-3 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] flex items-start gap-2.5">
              <Info size={15} className="text-[#EA580C] shrink-0 mt-0.5" />
              <p className="text-xs text-[#525252] leading-relaxed">
                <strong className="text-[#171717]">Customer Price:</strong> Your direct customer/reference rate. <br />
                <strong className="text-[#171717]">SODAARS Price:</strong> Your marketplace settlement basis. No fixed platform markups or commissions are hardcoded.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Customer Price (₹)
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    step="1000"
                    value={customerPrice}
                    onChange={(e) => setCustomerPrice(e.target.value)}
                    placeholder="e.g. 150000"
                    className="w-full text-xs pl-8 font-mono"
                  />
                  <DollarSign size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#737373]" />
                </div>
                <span className="text-[11px] text-[#737373] mt-0.5 block">
                  Reference client catalog price.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  SODAARS Price (₹)
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    step="1000"
                    value={sodaarsPrice}
                    onChange={(e) => setSodaarsPrice(e.target.value)}
                    placeholder="e.g. 125000"
                    className="w-full text-xs pl-8 font-mono"
                  />
                  <DollarSign size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#737373]" />
                </div>
                <span className="text-[11px] text-[#737373] mt-0.5 block">
                  Settlement price provided to SODAARS.
                </span>
              </div>
            </div>
          </div>

          {/* Section 5: Marketplace Participation */}
          <div className="space-y-4">
            <div className="border-b border-[#E5E5E5] pb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#737373]">
                5. Marketplace Participation
              </h4>
            </div>

            <div className="p-4 rounded-lg bg-white border border-[#E5E5E5] flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1 max-w-md">
                <span className="text-xs font-bold text-[#171717]">
                  Enable SODAARS Marketplace Participation
                </span>
                <p className="text-xs text-[#525252] leading-relaxed">
                  Allows this resource to be listed in the public SODAARS discovery portal for enterprise media planners.
                </p>
                <span className="text-[11px] font-medium text-amber-700 mt-1">
                  Boundary Rule: Marketplace Participation ≠ Availability. Date availability is governed separately in the Availability Engine.
                </span>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={marketplaceParticipation}
                  onChange={(e) => setMarketplaceParticipation(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EA580C]"></div>
              </label>
            </div>
          </div>

          {/* Section 6: Media & Description */}
          <div className="space-y-4">
            <div className="border-b border-[#E5E5E5] pb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#737373]">
                6. Media &amp; Description
              </h4>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">
                Media Photo URL
              </label>
              <div className="relative">
                <Input
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://... (or leave blank for placeholder)"
                  className="w-full text-xs pl-8"
                />
                <ImageIcon size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#737373]" />
              </div>
              <span className="text-[11px] text-[#737373] mt-0.5 block">
                Representative photograph of this physical hoarding/unipole face.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Physical site access, landmark references, visibility characteristics..."
                className="w-full text-xs p-2.5 rounded-md bg-white border border-[#E5E5E5] text-[#171717] focus:outline-none focus:border-[#EA580C]"
              />
            </div>
          </div>
        </form>
      </Drawer>

      {/* Embedded Location Inline Modal */}
      <LocationInlineModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSave={handleLocationCreated}
      />
    </>
  );
};

export default ResourceFormDrawer;

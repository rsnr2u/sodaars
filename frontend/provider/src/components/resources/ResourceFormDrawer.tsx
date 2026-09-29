import React, { useState, useEffect } from 'react';
import type {
  AdvertisingResource,
  AdvertisingResourcePayload,
  ResourceType,
  ResourceCategory,
  ResourceStatus,
  IlluminationType,
  DimensionUnit,
} from '../../types/resource';
import type { LocationOption } from './ResourceFilters';
import Drawer from '../ui/Drawer';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { getApiErrorMessage } from '../../services/api';
import { AlertTriangle, Layers, Info } from 'lucide-react';

export interface ResourceFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  resource?: AdvertisingResource | null;
  locations: LocationOption[];
  onSave: (payload: AdvertisingResourcePayload) => Promise<void>;
}

export const ResourceFormDrawer: React.FC<ResourceFormDrawerProps> = ({
  isOpen,
  onClose,
  resource,
  locations,
  onSave,
}) => {
  const isEditing = Boolean(resource);

  // Form Fields
  const [locationUuid, setLocationUuid] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [resourceType, setResourceType] = useState<ResourceType>('HOARDING');
  const [category, setCategory] = useState<ResourceCategory>('STATIC');
  const [status, setStatus] = useState<ResourceStatus>('ACTIVE');

  // Physical Specifications
  const [width, setWidth] = useState<string>('20');
  const [height, setHeight] = useState<string>('10');
  const [dimensionUnit, setDimensionUnit] = useState<DimensionUnit>('FEET');
  const [illuminationType, setIlluminationType] = useState<IlluminationType>('FRONT_LIT');
  const [faceNumber, setFaceNumber] = useState<string>('1');
  const [faceLabel, setFaceLabel] = useState('');
  const [direction, setDirection] = useState('');
  const [trafficFlow, setTrafficFlow] = useState('');

  // Digital Specifications (Conditional)
  const [resolution, setResolution] = useState('');
  const [pixelPitch, setPixelPitch] = useState('');
  const [slotDuration, setSlotDuration] = useState('');
  const [dailyImpressions, setDailyImpressions] = useState('');

  // Commercials & Operations
  const [operatingHoursFrom, setOperatingHoursFrom] = useState('');
  const [operatingHoursTo, setOperatingHoursTo] = useState('');
  const [basePriceMonthly, setBasePriceMonthly] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [description, setDescription] = useState('');
  const [installationDetails, setInstallationDetails] = useState('');
  const [notes, setNotes] = useState('');

  // Validation & Submission
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form on open or edit
  useEffect(() => {
    if (!isOpen) return;

    setErrors({});
    setApiError(null);

    if (resource) {
      setLocationUuid(resource.location?.uuid || '');
      setName(resource.name);
      setCode(resource.code);
      setResourceType(resource.resource_type);
      setCategory(resource.category);
      setStatus(resource.status);
      setWidth(resource.width ? resource.width.toString() : '20');
      setHeight(resource.height ? resource.height.toString() : '10');
      setDimensionUnit(resource.dimension_unit || 'FEET');
      setIlluminationType(resource.illumination_type || 'FRONT_LIT');
      setFaceNumber(resource.face_number ? resource.face_number.toString() : '1');
      setFaceLabel(resource.face_label || '');
      setDirection(resource.direction || '');
      setTrafficFlow(resource.traffic_flow || '');
      setResolution(resource.resolution || '');
      setPixelPitch(resource.pixel_pitch || '');
      setSlotDuration(resource.slot_duration_seconds ? resource.slot_duration_seconds.toString() : '');
      setDailyImpressions(resource.daily_impressions_estimate ? resource.daily_impressions_estimate.toString() : '');
      setOperatingHoursFrom(resource.operating_hours_from ? resource.operating_hours_from.substring(0, 5) : '');
      setOperatingHoursTo(resource.operating_hours_to ? resource.operating_hours_to.substring(0, 5) : '');
      setBasePriceMonthly(resource.base_price_monthly ? resource.base_price_monthly.toString() : '');
      setCurrency(resource.currency || 'INR');
      setDescription(resource.description || '');
      setInstallationDetails(resource.installation_details || '');
      setNotes(resource.notes || '');
    } else {
      setLocationUuid(locations[0]?.uuid || '');
      setName('');
      setCode('');
      setResourceType('HOARDING');
      setCategory('STATIC');
      setStatus('ACTIVE');
      setWidth('20');
      setHeight('10');
      setDimensionUnit('FEET');
      setIlluminationType('FRONT_LIT');
      setFaceNumber('1');
      setFaceLabel('');
      setDirection('');
      setTrafficFlow('');
      setResolution('');
      setPixelPitch('');
      setSlotDuration('');
      setDailyImpressions('');
      setOperatingHoursFrom('');
      setOperatingHoursTo('');
      setBasePriceMonthly('');
      setCurrency('INR');
      setDescription('');
      setInstallationDetails('');
      setNotes('');
    }
  }, [isOpen, resource, locations]);

  // Derived Area Calculation (UI Only - never submitted in payload)
  const numWidth = parseFloat(width) || 0;
  const numHeight = parseFloat(height) || 0;
  const derivedArea = (numWidth * numHeight).toFixed(1);
  const areaUnitLabel = dimensionUnit === 'METERS' ? 'sq m' : dimensionUnit === 'INCHES' ? 'sq in' : 'sq ft';

  // Auto-switch illumination to DIGITAL_LED when category changed to DIGITAL
  const handleCategoryChange = (newCat: ResourceCategory) => {
    setCategory(newCat);
    if (newCat === 'DIGITAL') {
      if (illuminationType === 'NON_LIT' || illuminationType === 'FRONT_LIT' || illuminationType === 'BACK_LIT') {
        setIlluminationType('DIGITAL_LED');
      }
    } else {
      if (illuminationType === 'DIGITAL_LED') {
        setIlluminationType('FRONT_LIT');
      }
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!locationUuid) errs.location_uuid = 'Location is required.';
    if (!name.trim()) errs.name = 'Resource name is required.';
    if (!code.trim()) errs.code = 'Resource code is required.';
    if (!width || parseFloat(width) <= 0) errs.width = 'Valid width is required (min 0.1).';
    if (!height || parseFloat(height) <= 0) errs.height = 'Valid height is required (min 0.1).';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError(null);

    const payload: AdvertisingResourcePayload = {
      location_uuid: locationUuid,
      name: name.trim(),
      code: code.trim().toUpperCase(),
      resource_type: resourceType,
      category,
      status,
      width: parseFloat(width),
      height: parseFloat(height),
      dimension_unit: dimensionUnit,
      illumination_type: illuminationType,
      face_number: faceNumber ? parseInt(faceNumber, 10) : undefined,
      face_label: faceLabel.trim() || undefined,
      direction: direction.trim() || undefined,
      traffic_flow: trafficFlow.trim() || undefined,
      operating_hours_from: operatingHoursFrom || undefined,
      operating_hours_to: operatingHoursTo || undefined,
      base_price_monthly: basePriceMonthly ? parseFloat(basePriceMonthly) : undefined,
      currency: currency || 'INR',
      description: description.trim() || undefined,
      installation_details: installationDetails.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    if (category === 'DIGITAL') {
      payload.resolution = resolution.trim() || undefined;
      payload.pixel_pitch = pixelPitch.trim() || undefined;
      payload.slot_duration_seconds = slotDuration ? parseInt(slotDuration, 10) : undefined;
      payload.daily_impressions_estimate = dailyImpressions ? parseInt(dailyImpressions, 10) : undefined;
    }

    try {
      await onSave(payload);
      onClose();
    } catch (err: unknown) {
      setApiError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div>
          <div>{isEditing ? `Edit Resource: ${resource?.name}` : 'Add Advertising Resource'}</div>
          <div style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-muted)', marginTop: '2px' }}>
            Configure physical specifications, rate card, and operational parameters.
          </div>
        </div>
      }
      maxWidth="680px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', width: '100%' }}>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Create Resource'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit}>
        {apiError && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--rose-50)',
              border: '1px solid var(--rose-200)',
              color: 'var(--rose-700)',
              marginBottom: '1.25rem',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
            }}
          >
            <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 600 }}>Action Required</div>
              <div>{apiError}</div>
            </div>
          </div>
        )}

        {/* Read-Only Slug Indicator (When editing existing resource) */}
        {isEditing && resource?.slug && (
          <div
            style={{
              padding: '0.6rem 0.85rem',
              backgroundColor: 'var(--canvas-bg)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              <Info size={14} style={{ color: 'var(--blue-600)' }} />
              <span>Public Discovery Slug:</span>
              <strong style={{ fontFamily: 'var(--font-mono)' }}>/resources/{resource.slug}</strong>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Read-Only
            </span>
          </div>
        )}

        {/* Section 1: Location & Identity */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--text-heading)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '0.4rem',
            }}
          >
            Location & Classification
          </h3>

          <div className="form-group">
            <label className="form-label required">Hosted Location</label>
            <select
              value={locationUuid}
              onChange={(e) => setLocationUuid(e.target.value)}
              className={`form-select ${errors.location_uuid ? 'error' : ''}`}
            >
              <option value="">Select a location...</option>
              {locations.map((loc) => (
                <option key={loc.uuid} value={loc.uuid}>
                  {loc.name} ({loc.code})
                </option>
              ))}
            </select>
            {errors.location_uuid && <div className="form-error">{errors.location_uuid}</div>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '0.75rem' }}>
            <Input
              label="Resource Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. NH-16 Highway Unipole Front Face"
              error={errors.name}
            />
            <Input
              label="Resource Code"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. UNIPOLE-H001"
              error={errors.code}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label required">Type</label>
              <select
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value as ResourceType)}
                className="form-select"
              >
                <option value="HOARDING">Hoarding</option>
                <option value="BILLBOARD">Billboard</option>
                <option value="UNIPOLE">Unipole</option>
                <option value="GANTRY">Gantry</option>
                <option value="LED_SCREEN">LED Screen</option>
                <option value="DIGITAL_SCREEN">Digital Screen</option>
                <option value="BUS_SHELTER">Bus Shelter</option>
                <option value="POLE_AD">Pole Ad</option>
                <option value="WALL_MOUNT">Wall Mount</option>
                <option value="ROOFTOP">Rooftop</option>
                <option value="BRIDGE_PANEL">Bridge Panel</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label required">Category</label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as ResourceCategory)}
                className="form-select"
              >
                <option value="STATIC">Static</option>
                <option value="DIGITAL">Digital</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ResourceStatus)}
                className="form-select"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                <option value="UNDER_REVIEW">Under Review</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Dimensions & Physical Specifications */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--text-heading)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '0.4rem',
            }}
          >
            Dimensions & Physical Specifications
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '0.75rem' }}>
            <Input
              label="Width"
              type="number"
              step="0.1"
              min="0.1"
              required
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              error={errors.width}
            />
            <Input
              label="Height"
              type="number"
              step="0.1"
              min="0.1"
              required
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              error={errors.height}
            />
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label required">Unit</label>
              <select
                value={dimensionUnit}
                onChange={(e) => setDimensionUnit(e.target.value as DimensionUnit)}
                className="form-select"
              >
                <option value="FEET">Feet (ft)</option>
                <option value="METERS">Meters (m)</option>
                <option value="INCHES">Inches (in)</option>
              </select>
            </div>
          </div>

          {/* Derived Area Display (UI Info Only) */}
          <div
            style={{
              marginTop: '0.6rem',
              padding: '6px 12px',
              backgroundColor: 'var(--blue-50)',
              borderRadius: 'var(--radius-xs)',
              fontSize: '0.8rem',
              color: 'var(--blue-800)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>Calculated Surface Area:</span>
            <strong>
              {derivedArea} {areaUnitLabel}
            </strong>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '0.75rem', marginTop: '0.85rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label required">Illumination</label>
              <select
                value={illuminationType}
                onChange={(e) => setIlluminationType(e.target.value as IlluminationType)}
                className="form-select"
              >
                <option value="FRONT_LIT">Front Lit</option>
                <option value="BACK_LIT">Back Lit</option>
                <option value="NON_LIT">Non Lit</option>
                <option value="DIGITAL_LED">Digital LED</option>
                <option value="SOLAR_LIT">Solar Lit</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <Input
              label="Face Number"
              type="number"
              min="1"
              value={faceNumber}
              onChange={(e) => setFaceNumber(e.target.value)}
              placeholder="1"
            />
            <Input
              label="Face Label"
              value={faceLabel}
              onChange={(e) => setFaceLabel(e.target.value)}
              placeholder="e.g. North, Face A"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
            <Input
              label="Facing Direction"
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
              placeholder="e.g. Toward Vijayawada city"
            />
            <Input
              label="Traffic Flow"
              value={trafficFlow}
              onChange={(e) => setTrafficFlow(e.target.value)}
              placeholder="e.g. 60,000+ vehicles/day highway flow"
            />
          </div>
        </div>

        {/* Section 3: Digital Specifications (Conditional) */}
        {category === 'DIGITAL' && (
          <div
            style={{
              marginBottom: '1.5rem',
              padding: '1rem',
              backgroundColor: 'var(--canvas-bg)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
              <Layers size={16} style={{ color: 'var(--blue-600)' }} />
              <h3
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-heading)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  margin: 0,
                }}
              >
                Digital Display Specifications
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <Input
                label="Resolution"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="e.g. 1920x1080"
              />
              <Input
                label="Pixel Pitch"
                value={pixelPitch}
                onChange={(e) => setPixelPitch(e.target.value)}
                placeholder="e.g. P6, P10"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
              <Input
                label="Slot Duration (Seconds)"
                type="number"
                min="1"
                value={slotDuration}
                onChange={(e) => setSlotDuration(e.target.value)}
                placeholder="e.g. 10"
              />
              <Input
                label="Daily Impressions Estimate"
                type="number"
                min="0"
                value={dailyImpressions}
                onChange={(e) => setDailyImpressions(e.target.value)}
                placeholder="e.g. 75000"
              />
            </div>
          </div>
        )}

        {/* Section 4: Operating Hours & Commercial Rate Card */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--text-heading)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '0.4rem',
            }}
          >
            Operating Hours & Indicative Rate Card
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Input
              label="Operating Hours From"
              type="time"
              value={operatingHoursFrom}
              onChange={(e) => setOperatingHoursFrom(e.target.value)}
            />
            <Input
              label="Operating Hours To"
              type="time"
              value={operatingHoursTo}
              onChange={(e) => setOperatingHoursTo(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
            <Input
              label="Indicative Monthly Rate"
              type="number"
              min="0"
              value={basePriceMonthly}
              onChange={(e) => setBasePriceMonthly(e.target.value)}
              placeholder="e.g. 85000 (Indicative rate card)"
              helperText="Shown on public discovery rate card as starting-from rate."
            />
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="form-select"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 5: Operational Notes */}
        <div style={{ marginBottom: '1rem' }}>
          <h3
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--text-heading)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '0.4rem',
            }}
          >
            Operational Information
          </h3>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Site visibility description, proximity to landmarks, eye-level vantage points..."
              rows={2}
              className="form-input"
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Installation Details</label>
            <textarea
              value={installationDetails}
              onChange={(e) => setInstallationDetails(e.target.value)}
              placeholder="Mounting structure, ladder access, power connection specs..."
              rows={2}
              className="form-input"
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Internal Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Maintenance schedules, landlord agreements, internal remarks..."
              rows={2}
              className="form-input"
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>
        </div>
      </form>
    </Drawer>
  );
};

export default ResourceFormDrawer;

import React from 'react';
import EmptyState from '../../components/ui/EmptyState';
import { MapPin, Plus } from 'lucide-react';
import Button from '../../components/ui/Button';

export const LocationsPage: React.FC = () => {
  return (
    <div>
      <div className="page-header">
        <div className="page-header-title-group">
          <h1>Locations</h1>
          <p>Manage physical sites, addresses, landmark descriptors, and geospatial coordinates.</p>
        </div>
        <Button variant="primary" leftIcon={<Plus size={16} />} disabled>
          Add Location (Step 2)
        </Button>
      </div>

      <EmptyState
        icon={<MapPin size={28} />}
        title="Location Management Engine"
        description="Physical site management will be integrated in Step 2. You will be able to pinpoint hoarding locations on interactive Leaflet maps, enter road descriptors, and manage site photos."
      />
    </div>
  );
};

export default LocationsPage;

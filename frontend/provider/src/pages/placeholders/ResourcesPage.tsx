import React from 'react';
import EmptyState from '../../components/ui/EmptyState';
import { Layers, Plus } from 'lucide-react';
import Button from '../../components/ui/Button';

export const ResourcesPage: React.FC = () => {
  return (
    <div>
      <div className="page-header">
        <div className="page-header-title-group">
          <h1>Advertising Resources</h1>
          <p>Inventory management for billboards, hoardings, unipoles, gantries, and digital screens.</p>
        </div>
        <Button variant="primary" leftIcon={<Plus size={16} />} disabled>
          Add Resource (Step 3)
        </Button>
      </div>

      <EmptyState
        icon={<Layers size={28} />}
        title="Advertising Resources & Media Gallery"
        description="Resource inventory workflows will be integrated in Step 3. You will configure physical specs, DOOH characteristics, indicative rate cards, immutable public slugs, and upload day/night site photos."
      />
    </div>
  );
};

export default ResourcesPage;

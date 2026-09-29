import React from 'react';
import EmptyState from '../../components/ui/EmptyState';
import { Calendar, Plus } from 'lucide-react';
import Button from '../../components/ui/Button';

export const AvailabilityPage: React.FC = () => {
  return (
    <div>
      <div className="page-header">
        <div className="page-header-title-group">
          <h1>Availability & Schedules</h1>
          <p>Real-time slot scheduling matrix, tentative hold management, and booking calendars.</p>
        </div>
        <Button variant="primary" leftIcon={<Plus size={16} />} disabled>
          Create Hold (Step 4)
        </Button>
      </div>

      <EmptyState
        icon={<Calendar size={28} />}
        title="Availability & Scheduling Matrix"
        description="The visual schedule calendar and operational hold workflows will be integrated in Step 4. Inspect resource availability by date range, place manual holds, and track schedule conflicts."
      />
    </div>
  );
};

export default AvailabilityPage;

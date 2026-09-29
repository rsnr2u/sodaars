import React from 'react';
import EmptyState from '../../components/ui/EmptyState';
import { Inbox } from 'lucide-react';

export const LeadsPage: React.FC = () => {
  return (
    <div>
      <div className="page-header">
        <div className="page-header-title-group">
          <h1>Directory Leads Inbox</h1>
          <p>Direct advertiser inquiries captured from the SODAARS Public Discovery Directory.</p>
        </div>
      </div>

      <EmptyState
        icon={<Inbox size={28} />}
        title="Directory Lead Inbox Engine"
        description="The interactive lead inbox will be integrated in Step 4. You will review advertiser contact inquiries, view immutable historical snapshots of requested sites, and transition lead statuses (NEW → CONTACTED → CONVERTED/ARCHIVED)."
      />
    </div>
  );
};

export default LeadsPage;

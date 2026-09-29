import React from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/ui/EmptyState';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div style={{ maxWidth: '480px', width: '100%' }}>
        <EmptyState
          icon={<FileQuestion size={32} />}
          title="Page Not Found"
          description="The page you are looking for does not exist, has been moved, or you do not have permission to view it."
          action={
            <Link to="/dashboard" className="btn btn-primary btn-md">
              <ArrowLeft size={16} />
              <span>Return to Dashboard</span>
            </Link>
          }
        />
      </div>
    </div>
  );
};

export default NotFoundPage;

import React from 'react';
import { Loader2 } from 'lucide-react';

export interface SpinnerProps {
  size?: number;
  className?: string;
  color?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 24,
  className = '',
  color = 'var(--blue-600)',
}) => {
  return <Loader2 className={`animate-spin ${className}`} size={size} style={{ color }} />;
};

export const FullPageLoader: React.FC<{ message?: string }> = ({ message = 'Loading workspace...' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: 'var(--canvas-bg)',
        gap: '1rem',
      }}
    >
      <Spinner size={36} />
      <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
        {message}
      </div>
    </div>
  );
};

export default Spinner;

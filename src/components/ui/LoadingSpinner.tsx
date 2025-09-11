import React from 'react';

interface LoadingSpinnerProps {
  label?: string;
  className?: string;
  size?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ label = 'Loading...', className = '', size = 32 }) => {
  const borderSize = Math.max(2, Math.round(size / 8));
  const style = {
    width: size,
    height: size,
    borderWidth: borderSize
  } as React.CSSProperties;

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div
        className="animate-spin rounded-full border-gray-200 border-b-blue-600"
        style={style}
      />
      {label && <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>}
    </div>
  );
};

export default LoadingSpinner;


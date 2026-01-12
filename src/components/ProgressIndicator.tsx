import React from 'react';
import { MergeProgress } from '../types';

interface ProgressIndicatorProps {
  progress: MergeProgress;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ progress }) => {
  if (progress.status === 'idle') {
    return null;
  }

  const percentage = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-800">Progress</h3>
        <span className="text-sm text-gray-600">
          {progress.current} / {progress.total}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
        <div
          className={`h-4 rounded-full transition-all duration-300 ${
            progress.status === 'error'
              ? 'bg-red-500'
              : progress.status === 'completed'
              ? 'bg-green-500'
              : 'bg-blue-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <p className="text-sm text-gray-600">
        {progress.status === 'processing' && `Processing document ${progress.current}...`}
        {progress.status === 'completed' && 'All documents processed successfully!'}
        {progress.status === 'error' && `Error: ${progress.message || 'Unknown error'}`}
      </p>
      
      {progress.message && progress.status !== 'error' && (
        <p className="text-xs text-gray-500 mt-1">{progress.message}</p>
      )}
    </div>
  );
};



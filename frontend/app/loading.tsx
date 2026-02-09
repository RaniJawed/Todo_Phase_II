'use client';

import React from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="lg" />
    </div>
  );
};

export default Loading;
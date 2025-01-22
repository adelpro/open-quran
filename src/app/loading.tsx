import React from 'react';

import Skeleton from '@/components/skeleton';

export default function loading() {
  return (
    <div className="mt-10 flex items-center justify-center">
      <Skeleton />
    </div>
  );
}

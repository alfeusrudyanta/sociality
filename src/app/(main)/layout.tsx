import type React from 'react';

import Headers from '@/components/Headers';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen flex-col'>
      <Headers />
      <div className='flex-grow'>{children}</div>
    </div>
  );
}

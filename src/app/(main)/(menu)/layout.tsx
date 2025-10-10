import type React from 'react';

import FloatingMenu from '@/components/FloatingMenu';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col'>
      <div className='flex-grow'>{children}</div>
      <FloatingMenu />
    </div>
  );
}

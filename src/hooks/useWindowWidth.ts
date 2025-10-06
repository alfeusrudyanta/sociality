'use client';

import { useEffect, useState } from 'react';

const useWindowWidth = () => {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = width !== null ? width < 768 : false;
  return isMobile;
};

export default useWindowWidth;

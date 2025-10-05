import { useEffect, useState } from 'react';

const useWindowWidth = () => {
  const getWidth = () =>
    typeof window !== 'undefined' ? window.innerWidth : 0;

  const [width, setWidth] = useState<number>(getWidth());

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = width < 768;
  return isMobile;
};

export default useWindowWidth;

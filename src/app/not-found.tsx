'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

const NotFound = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className='flex h-screen w-screen flex-col items-center justify-center bg-black px-4'>
      {/* Animated Title */}
      <h1
        className={`text-neutral-25 mb-6 text-6xl font-extrabold transition-all duration-700 ease-in-out md:text-8xl ${
          show ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
        }`}
      >
        404
      </h1>

      {/* Subtitle */}
      <p
        className={`text-neutral-25 mb-8 text-center text-lg transition-opacity duration-700 md:text-xl ${
          show ? 'opacity-100' : 'opacity-0'
        }`}
      >
        Oops! The page you are looking for does not exist.
      </p>

      {/* Home Button */}
      <Link href='/' className='w-full max-w-[300px]'>
        <Button variant='transparant'>Go Home</Button>
      </Link>
    </div>
  );
};

export default NotFound;

'use client';

import React from 'react';

import { Button } from '@/components/ui/button';

type ErrorProps = {
  reset: () => void;
};

const Error = ({ reset }: ErrorProps) => {
  return (
    <div className='flex h-screen w-screen flex-col items-center justify-center gap-6 text-center'>
      <div className='flex flex-col gap-2'>
        <span className='text-neutral-25 md:text-display-xs text-xl font-bold'>
          Something went wrong 😕
        </span>
        <span className='text-neutral-400'>
          We couldn’t load the data. Please try again later.
        </span>
      </div>
      <Button className='max-w-[200px]' onClick={() => reset()}>
        Try Again
      </Button>
    </div>
  );
};

export default Error;

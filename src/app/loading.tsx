import React from 'react';

const Loading = () => {
  return (
    <div className='flex h-screen w-screen items-center justify-center bg-black'>
      <span className='text-neutral-25 animate-pulse text-lg transition-opacity duration-500 md:text-xl'>
        Loading...
      </span>
    </div>
  );
};

export default Loading;

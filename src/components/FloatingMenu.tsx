'use client';

import { House, Plus, UserRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useMemo } from 'react';

import useMe from '@/hooks/queries/useMe';
import { cn } from '@/lib/utils';

import { Button } from './ui/button';

const FloatingMenu = () => {
  const pathname = usePathname();
  const { meQuery } = useMe();

  const profilePath = useMemo(() => {
    return `/profile/${meQuery.data?.data.profile.username}`;
  }, [meQuery.data?.data.profile.username]);

  return (
    <div className='fixed bottom-[32px] left-1/2 w-full max-w-[408px] -translate-x-1/2 px-6 md:bottom-[32px]'>
      <div className='flex h-16 w-full items-center justify-between gap-[45px] rounded-full border border-neutral-900 bg-neutral-950 px-8 md:h-20'>
        {/* Home */}
        <Link
          className='group flex flex-col items-center justify-center'
          href='/'
        >
          <House
            className={cn(
              'size-5 transition-all duration-200 group-hover:text-neutral-400 md:size-6',
              pathname === '/' &&
                'text-primary-200 group-hover:text-primary-200/90'
            )}
          />
          <span
            className={cn(
              'transition-all duration-200 group-hover:text-neutral-400',
              pathname === '/' &&
                'text-primary-200 group-hover:text-primary-200/90 font-bold'
            )}
          >
            Home
          </span>
        </Link>

        {/* Add Post */}
        <Link href='/addPost'>
          <Button size='rounded' className='transition-all duration-200'>
            <Plus />
          </Button>
        </Link>

        {/* Profile */}
        <Link
          className='group flex flex-col items-center justify-center'
          href={profilePath}
        >
          <UserRound
            className={cn(
              'size-5 transition-all duration-200 group-hover:text-neutral-400 md:size-6',
              pathname === profilePath &&
                'text-primary-200 group-hover:text-primary-200/90'
            )}
          />
          <span
            className={cn(
              'transition-all duration-200 group-hover:text-neutral-400',
              pathname === profilePath &&
                'text-primary-200 group-hover:text-primary-200/90 font-bold'
            )}
          >
            Profile
          </span>
        </Link>
      </div>
    </div>
  );
};

export default FloatingMenu;

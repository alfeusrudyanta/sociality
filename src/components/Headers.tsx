'use client';

import { Search, XIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

import useAuth from '@/hooks/queries/useAuth';
import useMe from '@/hooks/queries/useMe';
import useWindowWidth from '@/hooks/useWindowWidth';
import apiUsers from '@/services/queries/users';
import { UserSearch } from '@/types/users';

import { Input } from './ui/input';

const Headers = () => {
  const isMobile = useWindowWidth();
  const router = useRouter();

  const { meQuery } = useMe();
  const { logout } = useAuth();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSearhOpen, setIsSearchOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsSearchOpen(false);
  }, [isMobile]);

  const handleLogOut = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className='fixed z-10 h-[64px] w-full border-b border-neutral-900 bg-black md:h-20'>
      <div className='relative flex h-full w-full items-center justify-between gap-4 px-4 md:px-[120px]'>
        <Link href='/'>
          <div className='flex items-center gap-3'>
            <Image
              src='/icons/logo.svg'
              alt='Sociality Logo'
              height={30}
              width={30}
              className='size-[30px]'
            />
            <span className='text-display-xs md:text-display-xs font-bold'>
              Sociality
            </span>
          </div>
        </Link>

        {!isMobile && <SearchBar />}

        <div className='flex items-center gap-4'>
          {/* Search Icon */}
          {isMobile && (
            <Search
              onClick={() => setIsSearchOpen(true)}
              className='size-5 cursor-pointer'
            />
          )}

          {/* Profile Picture */}
          <div
            onClick={() => setIsOpen((prev) => !prev)}
            className='relative flex cursor-pointer items-center gap-3'
          >
            <Image
              src={
                meQuery.data?.data.profile.avatarUrl ??
                '/images/profile-picture.png'
              }
              alt={meQuery.data?.data.profile.name ?? 'User Profile Picture'}
              height={40}
              width={40}
              className='size-10 rounded-full'
            />

            {!isMobile && (
              <span className='font-bold'>
                {meQuery.data?.data.profile.name}
              </span>
            )}

            {isOpen && (
              <div className='absolute right-0 -bottom-15 w-[200px] rounded-[16px] border border-neutral-900 bg-neutral-950 px-4 py-2'>
                <button
                  onClick={handleLogOut}
                  className='hover:text-accent-red w-full cursor-pointer text-start transition-all duration-300'
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isSearhOpen && (
        <div className='absolute top-0 z-30 flex h-[64px] w-full items-center gap-4 bg-black px-4'>
          <SearchBar />

          <XIcon
            onClick={() => setIsSearchOpen(false)}
            className='size -4 cursor-pointer md:size-5'
          />
        </div>
      )}
    </div>
  );
};

export default Headers;

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [usersSearch, setUsersSearch] = useState<UserSearch[]>([]);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const pathname = usePathname();

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setQuery('');
  }, [pathname]);

  const handleSearch = async () => {
    if (query.trim().length === 0) return setQuery('');

    try {
      const params = {
        q: query.trim(),
        page: 1,
        limit: 5,
      };

      const data = await apiUsers.getUsersSearch(params);
      setUsersSearch(data.data.users);
      setShowSearch(true);
    } catch (e) {
      console.log('Error: ' + e);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div
      ref={containerRef}
      className='relative flex h-10 w-full items-center gap-2 rounded-full border border-neutral-900 bg-neutral-950 px-4 md:mx-4 md:h-12 md:max-w-[490px]'
    >
      <Search className='size-5 cursor-pointer' onClick={handleSearch} />

      <Input
        type='text'
        placeholder='Search'
        value={query}
        className='border-none px-0 outline-0 focus-visible:border-0 focus-visible:ring-0'
        onKeyDown={handleKeyDown}
        onChange={(e) => setQuery(e.target.value)}
      />

      {query.length > 0 && (
        <XIcon
          onClick={() => {
            setQuery('');
          }}
          className='size-4 cursor-pointer md:size-5'
        />
      )}

      {showSearch && (
        <div className='absolute top-[47px] flex w-full -translate-x-4 flex-col gap-4 rounded-[20px] border border-neutral-900 bg-neutral-950 p-4 md:top-[58px] md:p-5'>
          {usersSearch.length === 0 ? (
            <div className='flex flex-col items-center justify-center text-center md:h-[155px]'>
              <span className='font-bold'>No results found</span>
              <span className='text-neutral-400 md:text-sm'>
                Change your keyword
              </span>
            </div>
          ) : (
            usersSearch.map((user) => (
              <Link
                href={`/profile/${user.username}`}
                key={'Search: ' + user.id}
                className='group flex w-full cursor-pointer items-center gap-2'
              >
                <Image
                  src={user.avatarUrl ?? '/images/profile-picture.png'}
                  alt={user.name ?? 'User Profile Picture'}
                  height={48}
                  width={48}
                  className='size-12 rounded-full'
                />
                <div className='flex w-full flex-col'>
                  <span className='group-hover:text-primary-300 font-bold transition-all duration-300 md:text-sm'>
                    {user.name}
                  </span>
                  <span className='text-neutral-400 md:text-sm'>
                    {user.username}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
};

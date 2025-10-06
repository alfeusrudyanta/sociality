import { CircleCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  handleAddFollowing,
  handleDeleteFollowing,
} from '@/features/profile/profileSlice';
import useFollow from '@/hooks/queries/useFollow';
import useMe from '@/hooks/queries/useMe';

import { Button } from './ui/button';
import { DialogHeader, Dialog, DialogContent, DialogTitle } from './ui/dialog';

type FollowOverlayProps = {
  username: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  type: 'followers' | 'following';
};

const FollowOverlay: React.FC<FollowOverlayProps> = ({
  username,
  isOpen,
  setIsOpen,
  type,
}) => {
  const {
    usersFollowersQuery,
    usersFollowers,
    usersFollowingQuery,
    usersFollowing,
  } = useFollow(username);

  const follow = type === 'followers' ? usersFollowers : usersFollowing;
  const followQuery =
    type === 'followers' ? usersFollowersQuery : usersFollowingQuery;

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          followQuery.hasNextPage &&
          !followQuery.isFetchingNextPage
        ) {
          followQuery.fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.disconnect();
      }
    };
  }, [followQuery, followQuery.hasNextPage, followQuery.isFetchingNextPage]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className='flex flex-col gap-3 bg-neutral-950 md:max-w-[550px] md:gap-5'>
        <DialogHeader>
          <DialogTitle className='text-md font-bold md:text-xl'>
            {type === 'followers' ? 'Followers' : 'Following'}
          </DialogTitle>
        </DialogHeader>

        <div className='hide-scrollbar flex h-full max-h-[440px] flex-col gap-5 overflow-y-auto scroll-smooth'>
          {follow.map((user) => (
            <FollowPostCard
              key={'Follow user: ' + user.id}
              id={user.id}
              username={user.username}
              name={user.name}
              avatarUrl={user.avatarUrl}
              isFollowedByMe={user.isFollowedByMe}
            />
          ))}

          <div ref={loadMoreRef} className='flex items-center justify-center' />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowOverlay;

type FollowPostCardProps = {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
  isFollowedByMe: boolean;
};

const FollowPostCard: React.FC<FollowPostCardProps> = ({
  username,
  name,
  avatarUrl,
  isFollowedByMe,
}) => {
  const dispatch = useDispatch();
  const { meQuery } = useMe();

  const [followedByMe, setFollowedByMe] = useState<boolean>(
    () => isFollowedByMe
  );

  const { followMutation, unfollowMutation } = useFollow();
  const [profilePicture, setProfilePicture] = useState<string>(
    avatarUrl ?? '/images/profile-picture.png'
  );

  const handleFollow = () => {
    if (followedByMe) {
      unfollowMutation.mutate(username, {
        onSuccess: () => {
          setFollowedByMe(false);
          dispatch(handleDeleteFollowing());
        },
      });
    } else {
      followMutation.mutate(username, {
        onSuccess: () => {
          setFollowedByMe(true);
          dispatch(handleAddFollowing());
        },
      });
    }
  };

  return (
    <div className='flex items-center justify-between'>
      {/* Profile */}
      <Link href={`/profile/${username}`}>
        <div className='flex items-center gap-2'>
          <Image
            src={profilePicture}
            alt={name}
            height={48}
            width={48}
            className='size-12 rounded-full'
            onError={() => setProfilePicture('/images/profile-picture.png')}
          />

          <div className='flex flex-col'>
            <span className='font-bold md:text-sm'>{name}</span>
            <span className='text-neutral-400 md:text-sm'>{username}</span>
          </div>
        </div>
      </Link>

      {/* Follow Button */}
      {meQuery.data?.data.profile.username !== username && (
        <Button
          type='button'
          size='blank'
          onClick={handleFollow}
          variant={followedByMe ? 'transparant' : 'default'}
          className='px-4'
        >
          {followedByMe ? (
            <span className='flex items-center gap-2'>
              <CircleCheck />
              Following
            </span>
          ) : (
            'Follow'
          )}
        </Button>
      )}
    </div>
  );
};

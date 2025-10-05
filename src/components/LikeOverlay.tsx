import { CircleCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

import useFollow from '@/hooks/queries/useFollow';
import useLikes from '@/hooks/queries/useLikes';

import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

type LikeOverlayProps = {
  id: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const LikeOverlay: React.FC<LikeOverlayProps> = ({ id, isOpen, setIsOpen }) => {
  const { likesQuery, likedUsers } = useLikes(id);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          likesQuery.hasNextPage &&
          !likesQuery.isFetchingNextPage
        ) {
          likesQuery.fetchNextPage();
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
  }, [likesQuery, likesQuery.hasNextPage, likesQuery.isFetchingNextPage]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className='flex flex-col gap-3 bg-neutral-950 md:max-w-[550px] md:gap-5'>
        <DialogHeader>
          <DialogTitle className='text-md font-bold md:text-xl'>
            Like
          </DialogTitle>
        </DialogHeader>

        <div className='hide-scrollbar flex h-full max-h-[440px] flex-col gap-5 overflow-y-auto scroll-smooth'>
          {likedUsers.map((user) => (
            <LikedPostCard
              key={'Liked user: ' + user.id}
              id={user.id}
              username={user.username}
              name={user.name}
              avatarUrl={user.avatarUrl}
              isFollowedByMe={user.isFollowedByMe}
              isMe={user.isMe}
              followsMe={user.followsMe}
            />
          ))}

          <div ref={loadMoreRef} className='flex items-center justify-center' />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LikeOverlay;

type LikedPostCardProps = {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
  isFollowedByMe: boolean;
  isMe: boolean;
  followsMe: boolean;
};

const LikedPostCard: React.FC<LikedPostCardProps> = ({
  username,
  name,
  avatarUrl,
  isFollowedByMe,
  isMe,
}) => {
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
        },
      });
    } else {
      followMutation.mutate(username, {
        onSuccess: () => {
          setFollowedByMe(true);
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
      {!isMe && (
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

'use client';

import { Bookmark, CircleCheck, Heart, Send } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CommentOverlay from '@/components/CommentOverlay';
import FollowOverlay from '@/components/FollowOverlay';
import { Button } from '@/components/ui/button';

import Error from '@/app/error';
import Loading from '@/app/loading';
import { setPostInteractions } from '@/features/feed/feedSlice';
import { setProfile } from '@/features/profile/profileSlice';
import { AppDispatch, RootState } from '@/features/store';
import useFollow from '@/hooks/queries/useFollow';
import useMe from '@/hooks/queries/useMe';
import usePosts from '@/hooks/queries/usePosts';
import useSaves from '@/hooks/queries/useSaves';
import useUsers from '@/hooks/queries/useUsers';
import { cn } from '@/lib/utils';
import { Post } from '@/types/feed';

const Profile = () => {
  const [option, setOption] = useState<'gallery' | 'saved' | 'liked'>(
    'gallery'
  );

  const { meQuery } = useMe();
  const { username } = useParams<{ username: string }>();
  const { usersPostsQuery, usersLikesQuery, userQuery } = useUsers(username);
  const { meSavedQuery } = useSaves();

  const isLoading =
    meQuery.isLoading ||
    userQuery.isLoading ||
    usersLikesQuery.isLoading ||
    usersPostsQuery.isLoading ||
    meSavedQuery.isLoading;
  const isError =
    meQuery.isError ||
    userQuery.isError ||
    usersLikesQuery.isError ||
    usersPostsQuery.isError ||
    meSavedQuery.isError;

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <Error
        reset={() => {
          meQuery.refetch();
          userQuery.refetch();
          usersLikesQuery.refetch();
          usersPostsQuery.refetch();
          meSavedQuery.refetch();
        }}
      />
    );

  return (
    <div className='px-4 py-20 md:px-[315px] md:py-[120px]'>
      <div className='flex flex-col gap-4'>
        {/* User */}
        <User />

        {/* State */}
        <div className='flex flex-col gap-6'>
          {/* Menu */}
          <div className='flex w-full flex-row items-center text-center'>
            {/* Gallery */}
            <button
              onClick={() => setOption('gallery')}
              className={cn(
                'flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 border-b border-neutral-900 transition-all duration-300 md:gap-3',
                option === 'gallery' && 'border-neutral-25 border-b-[2px]'
              )}
            >
              <div className='relative size-5 md:size-6'>
                <Image
                  src='/icons/profile-gallery-gray.svg'
                  alt='Gallery gray'
                  fill
                  className={cn(
                    'absolute transition-opacity duration-300',
                    option === 'gallery' ? 'opacity-0' : 'opacity-100'
                  )}
                />
                <Image
                  src='/icons/profile-gallery-white.svg'
                  alt='Gallery white'
                  fill
                  className={cn(
                    'absolute transition-opacity duration-300',
                    option === 'gallery' ? 'opacity-100' : 'opacity-0'
                  )}
                />
              </div>
              <span
                className={cn(
                  'font-medium text-neutral-400 transition-all duration-300',
                  option === 'gallery' && 'text-neutral-25 font-bold'
                )}
              >
                Gallery
              </span>
            </button>

            {/* Saved */}
            {meQuery.data?.data.profile.username === username ? (
              <button
                onClick={() => setOption('saved')}
                className={cn(
                  'flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 border-b border-neutral-900 transition-all duration-300 md:gap-3',
                  option === 'saved' && 'border-neutral-25 border-b-[2px]'
                )}
              >
                <Bookmark
                  className={cn(
                    'fill-neutral-25 size-5 stroke-0 transition-all duration-300 md:size-6',
                    option !== 'saved' && 'fill-neutral-400 text-neutral-400'
                  )}
                />
                <span
                  className={cn(
                    'font-medium text-neutral-400 transition-all duration-300',
                    option === 'saved' && 'text-neutral-25 font-bold'
                  )}
                >
                  Saved
                </span>
              </button>
            ) : (
              <button
                onClick={() => setOption('liked')}
                className={cn(
                  'flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 border-b border-neutral-900 transition-all duration-300 md:gap-3',
                  option === 'liked' && 'border-neutral-25 border-b-[2px]'
                )}
              >
                <Heart
                  className={cn(
                    'fill-neutral-25 size-5 stroke-0 transition-all duration-300 md:size-6',
                    option !== 'liked' && 'fill-neutral-400 text-neutral-400'
                  )}
                />
                <span
                  className={cn(
                    'font-medium text-neutral-400 transition-all duration-300',
                    option === 'liked' && 'text-neutral-25 font-bold'
                  )}
                >
                  Liked
                </span>
              </button>
            )}
          </div>

          {/* Image List */}
          {option === 'gallery' && <GalleryFeeds />}
          {option === 'saved' && <SavedFeeds />}
          {option === 'liked' && <GalleryFeeds type='liked' />}
        </div>
      </div>
    </div>
  );
};

export default Profile;

const User = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const profile = useSelector((state: RootState) => state.profile);

  const { username } = useParams<{ username: string }>();
  const { meQuery } = useMe();
  const { user, userQuery } = useUsers(username);
  const { followMutation, unfollowMutation } = useFollow();
  const [followedByMe, setFollowedByMe] = useState<boolean>(
    () => user?.isFollowing ?? false
  );
  const [profilePicture, setProfilePicture] = useState<string>(
    user?.avatarUrl ?? '/images/profile-picture.png'
  );
  const [isFollowerOpen, setIsFollowerOpen] = useState<boolean>(false);
  const [isFollowingOpen, setIsFollowingOpen] = useState<boolean>(false);

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

  useEffect(() => {
    if (
      meQuery.isSuccess &&
      userQuery.isSuccess &&
      meQuery.data?.data?.profile?.username === username
    ) {
      dispatch(setProfile(userQuery.data.data));
    }
  }, [
    meQuery.isSuccess,
    userQuery.isSuccess,
    username,
    dispatch,
    meQuery.data?.data?.profile?.username,
    userQuery.data?.data,
  ]);

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
        {/* Profile */}
        <div className='flex items-center gap-3 md:gap-5'>
          <Image
            src={profilePicture}
            alt={user?.name ?? 'User Profile Picture'}
            height={64}
            width={64}
            className='size-[64px] rounded-full'
            onError={() => setProfilePicture('/images/profile-picture.png')}
          />

          <div className='flex flex-col'>
            <span className='font-bold'>{user?.name}</span>
            <span>{user?.username}</span>
          </div>
        </div>

        {/* Button */}
        <div className='flex flex-1 items-center justify-end gap-3'>
          {user?.isMe && (
            <Button
              onClick={() => router.push('/editProfile')}
              variant='transparant'
              className='md:max-w-[130px]'
            >
              Edit Profile
            </Button>
          )}

          {!user?.isMe && (
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
          <Button variant='transparant' size='rounded' className='size-10'>
            <Send />
          </Button>
        </div>
      </div>

      {/* Bio */}
      <span>{user?.bio}</span>

      {/* Status */}
      <div className='grid w-full grid-cols-4 divide-x divide-neutral-900'>
        {/* Post */}
        <div className='flex flex-1 flex-col gap-[2px] text-center'>
          <span className='text-lg font-bold md:text-xl'>
            {user?.counts.post}
          </span>
          <span className='text-xs text-neutral-400'>Post</span>
        </div>

        {/* Followers */}
        <button
          onClick={() => setIsFollowerOpen((prev) => !prev)}
          className='flex flex-1 cursor-pointer flex-col gap-[2px] text-center'
        >
          <span className='text-lg font-bold md:text-xl'>
            {user?.counts.followers}
          </span>
          <span className='text-xs text-neutral-400'>Followers</span>
        </button>

        {/* Following */}
        <button
          onClick={() => setIsFollowingOpen((prev) => !prev)}
          className='flex flex-1 cursor-pointer flex-col gap-[2px] text-center'
        >
          <span className='text-lg font-bold md:text-xl'>
            {meQuery.data?.data?.profile?.username === username
              ? profile.counts.following
              : user?.counts.following}
          </span>
          <span className='text-xs text-neutral-400'>Following</span>
        </button>

        {/* Likes */}
        <div className='flex flex-1 flex-col gap-[2px] text-center'>
          <span className='text-lg font-bold md:text-xl'>
            {user?.counts.likes}
          </span>
          <span className='text-xs text-neutral-400'>Likes</span>
        </div>
      </div>

      {isFollowerOpen && user?.username && (
        <FollowOverlay
          username={user?.username}
          isOpen={isFollowerOpen}
          setIsOpen={setIsFollowerOpen}
          type='followers'
        />
      )}

      {isFollowingOpen && user?.username && (
        <FollowOverlay
          username={user?.username}
          isOpen={isFollowingOpen}
          setIsOpen={setIsFollowingOpen}
          type='following'
        />
      )}
    </div>
  );
};

type GalleryFeedsProps = {
  type?: 'gallery' | 'liked';
};

const GalleryFeeds: React.FC<GalleryFeedsProps> = ({ type = 'gallery' }) => {
  const { meQuery } = useMe();
  const { username } = useParams<{ username: string }>();
  const { usersPostsQuery, usersPosts, usersLikesQuery, usersLikes } =
    useUsers(username);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const activeQuery = type === 'gallery' ? usersPostsQuery : usersLikesQuery;
  const activePosts = type === 'gallery' ? usersPosts : usersLikes;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          activeQuery.hasNextPage &&
          !activeQuery.isFetchingNextPage
        ) {
          activeQuery.fetchNextPage();
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
  }, [
    activeQuery,
    activeQuery.hasNextPage,
    activeQuery.isFetchingNextPage,
    activeQuery.fetchNextPage,
  ]);

  return (
    <div>
      {activePosts.length === 0 ? (
        <>
          {activePosts === usersPosts &&
            meQuery.data?.data.profile.username === username && (
              <div className='mx-auto flex max-w-[450px] flex-col items-center justify-center gap-6 pt-[50px] text-center'>
                <div className='flex flex-col gap-1'>
                  <span className='text-md font-bold md:text-lg'>
                    Your story starts here
                  </span>
                  <span className='text-neutral-400'>
                    Share your first post and let the world see your moments,
                    passions, and memories. Make this space truly yours.
                  </span>
                </div>
                <Link href='/addPost' className='w-full max-w-[260px]'>
                  <Button>Upload My First Post</Button>
                </Link>
              </div>
            )}

          {activePosts === usersPosts &&
            meQuery.data?.data.profile.username !== username && (
              <div className='mx-auto flex max-w-[450px] flex-col items-center justify-center gap-6 pt-[50px] text-center'>
                <div className='flex flex-col gap-1'>
                  <span className='text-md font-bold md:text-lg'>
                    This user never posts anything
                  </span>
                  <span className='text-neutral-400'>
                    Send them a message to get to know them better and share
                    your moments, passions, and memories with the world.
                  </span>
                </div>
              </div>
            )}

          {activePosts === usersLikes && (
            <div className='mx-auto flex max-w-[450px] flex-col items-center justify-center gap-6 pt-[50px] text-center'>
              <div className='flex flex-col gap-1'>
                <span className='text-md font-bold md:text-lg'>
                  This user never liked a post
                </span>
                <span className='text-neutral-400'>
                  Send them a message to get to know them better and share your
                  moments, passions, and memories with the world.
                </span>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className='grid grid-cols-3 gap-[2px] md:gap-1'>
          {activePosts.map((picture) => (
            <PostItem key={'Post Id:' + picture.id} id={picture.id} />
          ))}
        </div>
      )}

      {/* Scroll Status */}
      <div ref={loadMoreRef} className='flex items-center justify-center' />
    </div>
  );
};

const SavedFeeds = () => {
  const { meSavedQuery, savedPosts } = useSaves();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          meSavedQuery.hasNextPage &&
          !meSavedQuery.isFetchingNextPage
        ) {
          meSavedQuery.fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.disconnect();
    };
  }, [
    meSavedQuery,
    meSavedQuery.hasNextPage,
    meSavedQuery.isFetchingNextPage,
    meSavedQuery.fetchNextPage,
  ]);

  return (
    <div>
      {savedPosts.length === 0 ? (
        <div className='mx-auto flex max-w-[450px] flex-col items-center justify-center gap-6 pt-[50px] text-center'>
          <div className='flex flex-col gap-1'>
            <span className='text-md font-bold md:text-lg'>
              Your story starts here
            </span>
            <span className='text-neutral-400'>
              Share your first post and let the world see your moments,
              passions, and memories. Make this space truly yours.
            </span>
          </div>
          <Link href='/addPost' className='w-full max-w-[260px]'>
            <Button>Upload My First Post</Button>
          </Link>
        </div>
      ) : (
        <div className='grid grid-cols-3 gap-[2px] md:gap-1'>
          {savedPosts.map((post) => (
            <div key={post.id}>
              <PostItem key={'Saved Post Id:' + post.id} id={post.id} />
            </div>
          ))}
        </div>
      )}

      <div ref={loadMoreRef} className='flex items-center justify-center' />
    </div>
  );
};

const PostItem = ({ id }: { id: number }) => {
  const dispatch = useDispatch<AppDispatch>();
  const postInteractions = useSelector(
    (state: RootState) => state.feed.postInteractions
  );
  const { postQuery } = usePosts(id);

  useEffect(() => {
    if (postQuery.data && !postQuery.error) {
      dispatch(setPostInteractions([postQuery.data.data]));
    }
  }, [postQuery.data, postQuery.error, dispatch]);

  const postData = postInteractions[id];

  if (!postData) {
    return <div className='text-center'>Loading...</div>;
  }

  return <PictureList {...postData} />;
};

const PictureList: React.FC<Post> = (post) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [postImage, setPostImage] = useState<string>(
    post.imageUrl ?? '/images/post-img.png'
  );

  return (
    <div key={post.id}>
      <Image
        src={postImage}
        alt={'Picture about:' + post.caption}
        height={200}
        width={200}
        onClick={() => setIsOpen((prev) => !prev)}
        onError={() => setPostImage('/images/post-img.png')}
        className='aspect-square w-full cursor-pointer object-cover object-center'
      />

      <CommentOverlay
        id={post.id}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        postImage={post.imageUrl}
        caption={post.caption}
        authorImage={post.author.avatarUrl ?? '/images/profile-picture.png'}
        authorName={post.author.name}
        authorUsername={post.author.username}
        authorId={post.author.id}
        createdAt={post.createdAt}
        likedFeed={post.likedByMe}
        likeCount={post.likeCount}
        commentCount={post.commentCount}
      />
    </div>
  );
};

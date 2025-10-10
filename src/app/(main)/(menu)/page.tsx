'use client';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Bookmark, Heart, Send, MessageSquareMore } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import CommentOverlay from '@/components/CommentOverlay';
import LikeOverlay from '@/components/LikeOverlay';

import {
  setPostInteractions,
  updatePostLikes,
  updatePostUnLikes,
} from '@/features/feed/feedSlice';
import { AppDispatch, RootState } from '@/features/store';
import useFeed from '@/hooks/queries/useFeed';
import useLikes from '@/hooks/queries/useLikes';
import useSaves from '@/hooks/queries/useSaves';
import { cn } from '@/lib/utils';
import { Post } from '@/types/feed';

const Home = () => {
  const { feedQuery, allPosts } = useFeed();

  const dispatch = useDispatch<AppDispatch>();
  const postInteractions = useSelector(
    (state: RootState) => state.feed.postInteractions
  );
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          feedQuery.hasNextPage &&
          !feedQuery.isFetchingNextPage
        ) {
          feedQuery.fetchNextPage();
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
    feedQuery,
    feedQuery.hasNextPage,
    feedQuery.isFetchingNextPage,
    feedQuery.fetchNextPage,
  ]);

  useEffect(() => {
    if (allPosts.length > 0) {
      dispatch(setPostInteractions(allPosts));
    }
  }, [allPosts, dispatch]);

  return (
    <div className='my-20 md:my-[120px]'>
      <div className='mx-auto flex w-full max-w-[632px] flex-col gap-4 px-4 md:gap-6'>
        {allPosts.length === 0
          ? !feedQuery.isLoading && (
              <div className='flex items-center justify-center py-40 text-center'>
                <span className='text-xl font-bold md:text-xl'>
                  Start by following other user!
                </span>
              </div>
            )
          : allPosts.map((feed, index) => {
              const interaction = postInteractions[feed.id];

              return (
                <div
                  key={'Feed: ' + feed.id}
                  className='flex flex-col gap-4 md:gap-6'
                >
                  <FeedCard
                    id={interaction?.id ?? feed.id}
                    imageUrl={interaction?.imageUrl ?? feed.imageUrl}
                    caption={interaction?.caption ?? feed.caption}
                    createdAt={interaction?.createdAt ?? feed.createdAt}
                    author={interaction?.author ?? feed.author}
                    likeCount={interaction?.likeCount ?? feed.likeCount}
                    commentCount={
                      interaction?.commentCount ?? feed.commentCount
                    }
                    likedByMe={interaction?.likedByMe ?? feed.likedByMe}
                  />

                  {/* Line */}
                  {index < allPosts.length - 1 && (
                    <div className='w-full border border-neutral-900' />
                  )}
                </div>
              );
            })}

        {/* Scroll Status */}
        <div ref={loadMoreRef} className='flex items-center justify-center' />
      </div>
    </div>
  );
};

export default Home;

const FeedCard: React.FC<Post> = (feed) => {
  const dispatch = useDispatch<AppDispatch>();

  const [profilePicture, setProfilePicture] = useState<string>(
    feed.author.avatarUrl ?? '/images/profile-picture.png'
  );
  const [postImage, setPostImage] = useState<string>(
    feed.imageUrl ?? '/images/post-img.png'
  );
  const [saved, setSaved] = useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(false);
  const [isLikeOpen, setIslikeOpen] = useState<boolean>(false);
  const [isCommentOpen, setIsCommentOpen] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [isClamped, setIsClamped] = useState<boolean>(false);
  const spanRef = useRef<HTMLSpanElement>(null);

  const { saveMutation, unsaveMutation } = useSaves(feed.id);
  const { likeMutation, unlikeMutation } = useLikes(feed.id);

  const handleSave = () => {
    if (!saved) {
      saveMutation.mutate(undefined, {
        onSuccess: () => {
          setSaved(true);
        },
      });
    } else {
      unsaveMutation.mutate(undefined, {
        onSuccess: () => {
          setSaved(false);
        },
      });
    }
  };

  const handleLike = () => {
    if (!feed.likedByMe) {
      likeMutation.mutate(feed.id, {
        onSuccess: () => {
          toast.success('Liked', {
            style: {
              background: '#079455',
              color: 'white',
              borderRadius: '10px',
              height: '40px',
              border: 'none',
              margin: '70px 0px 0px 0px',
            },
          });
          dispatch(updatePostLikes({ postId: feed.id }));
        },
      });
    } else {
      unlikeMutation.mutate(feed.id, {
        onSuccess: () => {
          toast.error('Unliked', {
            style: {
              background: '#d9206e',
              color: 'white',
              borderRadius: '10px',
              height: '40px',
              border: 'none',
              margin: '70px 0px 0px 0px',
            },
          });
          dispatch(updatePostUnLikes({ postId: feed.id }));
        },
      });
    }
  };

  useEffect(() => {
    const span = spanRef.current;
    if (span) {
      setIsClamped(span.scrollHeight > span.clientHeight);
    }
  }, [feed.caption]);

  const handleDelete = () => {
    setIsDeleted(true);
  };

  if (isDeleted) {
    return null;
  }

  dayjs.extend(relativeTime);

  return (
    <div className='flex flex-col gap-2 md:gap-3'>
      {/* Creator */}
      <div className='flex items-center gap-2 md:gap-3'>
        <Link href={`/profile/${feed.author.username}`}>
          <Image
            src={profilePicture}
            alt={feed.author.name}
            height={44}
            width={44}
            className='size-11 rounded-full md:size-16'
            onError={() => setProfilePicture('/images/profile-picture.png')}
          />
        </Link>
        <div className='flex flex-col'>
          <Link href={`/profile/${feed.author.username}`}>
            <span className='font-bold'>{feed.author.name}</span>
          </Link>
          <span className='md:text-sm'>{dayjs(feed.createdAt).fromNow()}</span>
        </div>
      </div>

      {/* Image */}
      <div className='aspect-square max-h-[600px] w-full max-w-[600px] overflow-hidden rounded-[8px]'>
        <Image
          src={postImage}
          alt='Feed Image'
          height={600}
          width={600}
          onClick={handleLike}
          className='h-full w-full cursor-pointer object-cover object-center'
          onError={() => setPostImage('/images/post-img.png')}
        />
      </div>

      {/* Icons */}
      <div className='flex items-center justify-between'>
        <div className='flex h-[28px] items-center gap-3 md:h-[30px] md:gap-4'>
          <div className='flex items-center gap-[6px]'>
            <Heart
              className={cn(
                'size-6 cursor-pointer',
                feed.likedByMe && 'fill-accent-red stroke-accent-red'
              )}
              onClick={handleLike}
            />
            <span
              onClick={() => setIslikeOpen((prev) => !prev)}
              className='cursor-pointer font-semibold'
            >
              {feed.likeCount}
            </span>
          </div>
          <div
            onClick={() => setIsCommentOpen((prev) => !prev)}
            className='flex cursor-pointer items-center gap-[6px]'
          >
            <MessageSquareMore className='size-6 cursor-pointer' />
            <span className='font-semibold'>{feed.commentCount}</span>
          </div>
          <div className='flex cursor-pointer items-center gap-[6px]'>
            <Send className='size-6' />
            <span className='font-semibold'>0</span>
          </div>
        </div>

        <Bookmark
          onClick={handleSave}
          className={cn('size-6 cursor-pointer', saved && 'fill-neutral-25')}
        />
      </div>

      {/* Detail */}
      <div className='flex w-[88%] flex-col md:gap-1'>
        <Link href={`/profile/${feed.author.username}`}>
          <span className='font-bold'>{feed.author.username}</span>
        </Link>

        <span
          ref={spanRef}
          className={cn('md:text-sm', showMore ? '' : 'line-clamp-2')}
        >
          {feed.caption}
        </span>

        {!showMore && isClamped && (
          <span
            onClick={() => setShowMore(true)}
            className='text-primary-200 cursor-pointer font-bold md:font-semibold'
          >
            Show More
          </span>
        )}
      </div>

      <LikeOverlay id={feed.id} isOpen={isLikeOpen} setIsOpen={setIslikeOpen} />
      <CommentOverlay
        key={'Feed Id: ' + feed.id}
        id={feed.id}
        isOpen={isCommentOpen}
        setIsOpen={setIsCommentOpen}
        postImage={postImage}
        caption={feed.caption}
        authorImage={profilePicture}
        authorUsername={feed.author.username}
        authorName={feed.author.name}
        authorId={feed.author.id}
        createdAt={feed.createdAt}
        likedFeed={feed.likedByMe}
        likeCount={feed.likeCount}
        commentCount={feed.commentCount}
        onDelete={handleDelete}
      />
    </div>
  );
};

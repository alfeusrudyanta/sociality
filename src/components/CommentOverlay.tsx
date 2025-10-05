import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  Bookmark,
  Ellipsis,
  Heart,
  MessageSquareMore,
  Send,
  Smile,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

import {
  updatePostComments,
  updatePostLikes,
  updatePostUnLikes,
} from '@/features/feed/feedSlice';
import useComments from '@/hooks/queries/useComments';
import useLikes from '@/hooks/queries/useLikes';
import useSaves from '@/hooks/queries/useSaves';
import { cn } from '@/lib/utils';
import { Comments } from '@/types/comments';

import LikeOverlay from './LikeOverlay';
import { Button } from './ui/button';
import { DialogHeader, Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';

type CommentOverlayProps = {
  id: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  postImage: string;
  caption: string;
  authorImage: string;
  authorName: string;
  authorUsername: string;
  authorId: number;
  createdAt: string;
  likedFeed: boolean;
  likeCount: number;
  commentCount: number;
};

const CommentOverlay: React.FC<CommentOverlayProps> = ({
  id,
  isOpen,
  setIsOpen,
  postImage,
  caption,
  authorImage,
  authorName,
  authorUsername,
  createdAt,
  likedFeed,
  likeCount,
  commentCount,
}) => {
  const dispatch = useDispatch();

  const { postCommentMutation, comments, commentsQuery } = useComments(id);
  const { likeMutation, unlikeMutation } = useLikes(id);
  const { saveMutation, unsaveMutation } = useSaves(id);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  const [textInput, setTextInput] = useState<string>('');
  const [saved, setSaved] = useState<boolean>(false);
  const [isLikeOpen, setIslikeOpen] = useState<boolean>(false);

  dayjs.extend(relativeTime);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          commentsQuery.hasNextPage &&
          !commentsQuery.isFetchingNextPage
        ) {
          commentsQuery.fetchNextPage();
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
    commentsQuery,
    commentsQuery.hasNextPage,
    commentsQuery.isFetchingNextPage,
  ]);

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
    if (!likedFeed) {
      likeMutation.mutate(id, {
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
          dispatch(updatePostLikes({ postId: id }));
        },
      });
    } else {
      unlikeMutation.mutate(id, {
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
          dispatch(updatePostUnLikes({ postId: id }));
        },
      });
    }
  };

  const handlePostComment = () => {
    if (textInput.length === 0) return;

    postCommentMutation.mutate(
      { text: textInput },
      {
        onSuccess: () => {
          dispatch(updatePostComments({ postId: id }));
          setTextInput('');
          commentsQuery.refetch();
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlePostComment();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className='flex max-h-[60%] bg-neutral-950 pt-12 md:max-h-[760px] md:max-w-[1200px] md:gap-5'>
        <DialogHeader>
          <DialogTitle className='text-md font-bold md:text-xl'></DialogTitle>
        </DialogHeader>

        {/* Column Left */}
        <div
          onClick={handleLike}
          className='hidden aspect-square max-h-[720px] w-full max-w-[720px] flex-6 overflow-hidden md:flex'
        >
          <Image
            src={postImage}
            alt='Feed Image'
            height={720}
            width={720}
            className='h-full w-full cursor-pointer object-cover object-center'
          />
        </div>

        {/* Column Right */}
        <div className='flex flex-4 flex-col gap-3 md:gap-4'>
          {/* Feed Detail */}
          <div className='hidden flex-col gap-2 md:flex'>
            {/* Author */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <Link href={`/profile/${authorUsername}`}>
                  <Image
                    src={authorImage}
                    alt={authorName}
                    height={40}
                    width={40}
                    className='size-10 rounded-full'
                  />
                </Link>

                {/* Name */}
                <div className='flex flex-col'>
                  <Link href={`/profile/${authorUsername}`}>
                    <span className='font-bold md:text-sm'>{authorName}</span>
                  </Link>

                  <span className='text-xs text-neutral-400'>
                    {dayjs(createdAt).fromNow()}
                  </span>
                </div>
              </div>
              <Ellipsis className='cursor-pointer' />
            </div>

            {/* Scrollable Caption */}
            <div className='hide-scrollbar h-[140px] overflow-y-auto scroll-smooth'>
              <span className='md:text-sm'>{caption}</span>
            </div>

            <div className='w-full border border-neutral-900' />
          </div>

          {/* Comment List */}
          <div className='flex h-full flex-col gap-3 md:gap-4'>
            <span className='text-md font-bold'>Comments</span>
            <div className='hide-scrollbar flex h-full max-h-[400px] flex-col gap-3 overflow-y-auto scroll-smooth md:max-h-[300px] md:gap-4'>
              {comments.length !== 0 ? (
                <>
                  {comments.map((comment, index) => (
                    <div
                      key={comment.id}
                      className='flex flex-col gap-3 md:gap-4'
                    >
                      {/* Comment */}
                      <CommentCard
                        id={comment.id}
                        text={comment.text}
                        createdAt={comment.createdAt}
                        author={comment.author}
                      />

                      {/* Line */}
                      {index < comments.length - 1 && (
                        <div className='w-full border border-neutral-900' />
                      )}
                    </div>
                  ))}
                  <div
                    ref={loadMoreRef}
                    className='flex items-center justify-center'
                  />
                </>
              ) : (
                <div className='flex h-[155px] items-center justify-center text-center'>
                  <div className='flex flex-col gap-1'>
                    <span className='text-md font-bold'>No Comments yet</span>
                    <span className='text-neutral-400 md:text-sm'>
                      Start the conversation
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Icons */}
            <div className='hidden items-center justify-between md:flex'>
              <div className='flex h-[28px] items-center gap-3 md:h-[30px] md:gap-4'>
                <div className='flex items-center gap-[6px]'>
                  <Heart
                    className={cn(
                      'size-6 cursor-pointer',
                      likedFeed && 'fill-accent-red stroke-accent-red'
                    )}
                    onClick={handleLike}
                  />
                  <span
                    onClick={() => setIslikeOpen((prev) => !prev)}
                    className='cursor-pointer font-semibold'
                  >
                    {likeCount}
                  </span>
                </div>
                <div className='flex cursor-pointer items-center gap-[6px]'>
                  <MessageSquareMore className='size-6 cursor-pointer' />
                  <span className='font-semibold'>{commentCount}</span>
                </div>
                <div className='flex items-center gap-[6px]'>
                  <Send className='size-6 cursor-pointer' />
                  <span className='font-semibold'>0</span>
                </div>
              </div>

              <Bookmark
                onClick={handleSave}
                className={cn(
                  'size-6 cursor-pointer',
                  saved && 'fill-neutral-25'
                )}
              />
            </div>

            {/* Post Comment */}
            <div className='flex items-center gap-2'>
              <Button
                variant='transparant'
                size='blank'
                className='size-12 cursor-pointer rounded-[12px]'
              >
                <Smile />
              </Button>

              <div className='flex h-12 w-full items-center gap-2 rounded-[12px] border border-neutral-900'>
                <Input
                  type='text'
                  placeholder='Add Comment'
                  value={textInput}
                  onKeyDown={handleKeyDown}
                  disabled={postCommentMutation.isPending}
                  onChange={(e) => setTextInput(e.currentTarget.value)}
                  className='max-w-[80%] focus-visible:ring-0'
                />
                <button
                  disabled={textInput.length === 0}
                  onClick={handlePostComment}
                  className={cn(
                    'cursor-pointer disabled:text-neutral-600',
                    textInput.length > 0 && 'text-primary-200'
                  )}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>

        <LikeOverlay id={id} isOpen={isLikeOpen} setIsOpen={setIslikeOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default CommentOverlay;

const CommentCard: React.FC<Comments> = (comment) => {
  const [profilePicture, setProfilePicture] = useState<string>(
    comment.author.avatarUrl ?? '/images/profile-picture.png'
  );

  dayjs.extend(relativeTime);

  return (
    <div className='flex flex-col gap-2 md:gap-[10px]'>
      <div className='flex items-center gap-2'>
        <Link href={`/profile/${comment.author.username}`}>
          <Image
            src={profilePicture}
            alt={comment.author.name}
            height={40}
            width={40}
            onError={() => setProfilePicture('/images/profile-picture.png')}
            className='size-10 rounded-full'
          />
        </Link>

        <div className='flex flex-col'>
          <Link href={`/profile/${comment.author.username}`}>
            <span className='text-xs font-bold md:text-sm'>
              {comment.author.name}
            </span>
          </Link>
          <span className='text-xs text-neutral-400 md:text-xs'>
            {dayjs(comment.createdAt).fromNow()}
          </span>
        </div>
      </div>
      <span className='text-xs md:text-sm'>{comment.text}</span>
    </div>
  );
};

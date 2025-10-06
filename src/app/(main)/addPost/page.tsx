'use client';

import { ArrowLeft, ArrowUpToLine, CloudUpload, Trash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import useMe from '@/hooks/queries/useMe';
import usePosts from '@/hooks/queries/usePosts';

const AddPost = () => {
  const router = useRouter();
  const { createPostMutation } = usePosts();
  const { meQuery } = useMe();

  const [text, setText] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const [imageFile, setImageFile] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { files: FileList | null } }
  ) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      setImageFile(URL.createObjectURL(file));
      setFile(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddPost = (e: FormEvent) => {
    e.preventDefault();

    if (!imageFile) return setErrorMsg('Please upload an image before posting');
    if (text.length === 0) return setErrorMsg('Caption must not be empty');
    if (!file) return;

    setErrorMsg('');

    createPostMutation.mutate(
      { image: file, caption: text },
      {
        onSuccess: () => {
          toast.success('Success Post', {
            style: {
              background: '#079455',
              color: 'white',
              borderRadius: '10px',
              height: '40px',
              border: 'none',
              margin: '70px 0px 0px 0px',
            },
          });
          router.push('/');
        },
        onError: () => {
          toast.error('Network error. Please try again later', {
            style: {
              background: '#d9206e',
              color: 'white',
              borderRadius: '10px',
              height: '40px',
              border: 'none',
              margin: '70px 0px 0px 0px',
            },
          });
        },
      }
    );
  };

  return (
    <div className='relative'>
      {/* Mobile Back */}
      <div className='absolute top-0 z-20 flex h-[64px] w-full items-center justify-between border-b border-neutral-900 bg-black px-4 md:hidden'>
        <Link href='/' className='flex items-center gap-3'>
          <ArrowLeft className='size-[24px]' />
          <span className='text-md font-bold'>Add Post</span>
        </Link>

        <Link href={`/profile/${meQuery.data?.data.profile.username}`}>
          <Image
            src={
              meQuery.data?.data.profile.avatarUrl ??
              '/images/profile-picture.png'
            }
            alt={meQuery.data?.data.profile.name ?? 'User Profile Picture'}
            height={40}
            width={40}
            className='size-10 cursor-pointer rounded-full'
          />
        </Link>
      </div>

      <div className='mx-auto flex w-full max-w-[450px] flex-col gap-6 px-4 py-[120px] md:px-0'>
        {/* Desktop Back */}
        <Link
          href='/'
          className='hidden cursor-pointer items-center gap-3 md:flex'
        >
          <ArrowLeft className='size-[32px]' />
          <span className='text-display-xs font-bold'>Add Post</span>
        </Link>

        <div className='flex flex-col gap-[2px]'>
          <span className='font-bold md:text-sm'>Photo</span>

          {/*  Image */}
          {!imageFile && (
            <div
              className='relative flex h-[140px] flex-col items-center gap-4 rounded-[12px] border border-neutral-900 bg-neutral-950'
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleImageChange({ target: { files: e.dataTransfer.files } });
              }}
            >
              <Input
                id='image'
                type='file'
                accept='image/*'
                onChange={handleImageChange}
                disabled={createPostMutation.isPending}
                className='absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0'
              />
              <div className='absolute inset-0 flex flex-col items-center justify-center gap-1 font-semibold text-neutral-600 md:text-sm'>
                <div className='flex items-center justify-center rounded-[8px] border border-neutral-900 p-2'>
                  <CloudUpload />
                </div>
                <span>
                  <span className='text-primary-200'>Click or drag</span> to
                  upload an image
                </span>
                <span>PNG or JPG (max. 5mb)</span>
              </div>
            </div>
          )}

          {imageFile && (
            <div className='flex flex-col items-center gap-4 rounded-[12px] border border-neutral-900 p-4'>
              <div className='flex flex-col gap-3'>
                <div className='mx-auto aspect-square overflow-hidden'>
                  <Image
                    src={imageFile}
                    alt='Image Preview'
                    height={140}
                    width={140}
                    onError={(e) =>
                      (e.currentTarget.src = '/images/book-no-cover.jpg')
                    }
                    className='h-full w-full object-cover object-center'
                  />
                </div>
                <div className='flex flex-row justify-center gap-3'>
                  <Button
                    type='button'
                    variant='transparant'
                    disabled={createPostMutation.isPending}
                    onClick={handleTriggerFileInput}
                    className='rounded-[10px] bg-neutral-900 px-3 font-medium hover:bg-neutral-900/90 md:h-10 md:text-sm'
                  >
                    <ArrowUpToLine height={20} width={20} />
                    Change&nbsp;Image
                  </Button>

                  <Button
                    type='button'
                    variant='transparant'
                    disabled={createPostMutation.isPending}
                    onClick={handleRemoveImage}
                    className='text-accent-red rounded-[10px] bg-neutral-900 px-3 font-medium hover:bg-neutral-900/90 md:h-10 md:text-sm'
                  >
                    <Trash height={20} width={20} />
                    Delete&nbsp;Image
                  </Button>
                </div>
                <span className='text-center md:text-sm'>
                  PNG or JPG (max. 5mb)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Caption */}
        <div className='flex flex-col gap-[2px]'>
          <span className='font-bold md:text-sm'>Caption</span>
          <textarea
            required
            value={text}
            placeholder='Enter your caption'
            onChange={(e) => setText(e.currentTarget.value)}
            disabled={createPostMutation.isPending}
            className='h-[200px] rounded-[12px] border border-neutral-900 bg-neutral-950 px-4 py-2'
          />
        </div>

        {/* Error */}
        {errorMsg && (
          <span className='text-accent-red md:text-sm'>{errorMsg}</span>
        )}

        {/* Button */}
        <Button
          disabled={createPostMutation.isPending}
          onClick={handleAddPost}
          type='button'
        >
          {createPostMutation.isPending ? 'Sharing...' : 'Share'}
        </Button>
      </div>
    </div>
  );
};

export default AddPost;

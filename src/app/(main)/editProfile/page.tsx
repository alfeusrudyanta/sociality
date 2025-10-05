'use client';

import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import useMe from '@/hooks/queries/useMe';
import UserSchema from '@/schemas/userSchema';

const ProfileSchema = UserSchema.pick({
  name: true,
  username: true,
  phone: true,
});
type ProfileInput = z.infer<typeof ProfileSchema>;

const EditProfile = () => {
  const router = useRouter();
  const { meQuery, patchMeMutation } = useMe();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageFile, setImageFile] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProfileInput, string>>
  >({});

  useEffect(() => {
    if (meQuery.data) {
      const { profile } = meQuery.data.data;
      setImageFile(profile.avatarUrl ?? null);
      setName(profile.name ?? '');
      setUsername(profile.username ?? '');
      setPhone(profile.phone ?? '');
      setBio(profile.bio ?? '');
    }
  }, [meQuery.data]);

  const handleTriggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleImageChange = useCallback(
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | { target: { files: FileList | null } }
    ) => {
      const files = 'nativeEvent' in e ? e.target.files : e.target.files;

      if (files?.[0]) {
        const selectedFile = files[0];

        if (!selectedFile.type.startsWith('image/')) {
          setErrors((prev) => ({
            ...prev,
            avatar: 'Please select a valid image file',
          }));
          return;
        }

        if (imageFile && imageFile.startsWith('blob:')) {
          URL.revokeObjectURL(imageFile);
        }

        setImageFile(URL.createObjectURL(selectedFile));
        setFile(selectedFile);
      }
    },
    [imageFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleImageChange({ target: { files: e.dataTransfer.files } });
    },
    [handleImageChange]
  );

  const handleSave = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const result = ProfileSchema.safeParse({ name, username, phone });

      if (!result.success) {
        const fieldErrors: Partial<Record<keyof ProfileInput, string>> = {};
        result.error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof ProfileInput;
          if (field) {
            fieldErrors[field] = issue.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }

      setErrors({});

      if (file) {
        patchMeMutation.mutate(
          { name, username, phone, bio, avatar: file },
          {
            onSuccess: () => {
              const usernameRoute =
                meQuery.data?.data.profile.username ?? username;
              toast.success('Profile Updated', {
                style: {
                  background: '#079455',
                  color: 'white',
                  borderRadius: '10px',
                  height: '40px',
                  border: 'none',
                  margin: '70px 0px 0px 0px',
                },
              });
              router.push(`/profile/${usernameRoute}`);
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

        return;
      }

      patchMeMutation.mutate(
        {
          name,
          username,
          phone,
          bio,
          avatarUrl: meQuery.data?.data.profile.avatarUrl ?? '',
        },
        {
          onSuccess: () => {
            const usernameRoute =
              meQuery.data?.data.profile.username ?? username;
            toast.success('Profile Updated', {
              style: {
                background: '#079455',
                color: 'white',
                borderRadius: '10px',
                height: '40px',
                border: 'none',
                margin: '70px 0px 0px 0px',
              },
            });
            router.push(`/profile/${usernameRoute}`);
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
    },
    [name, username, phone, bio, file, patchMeMutation, meQuery.data, router]
  );

  useEffect(() => {
    return () => {
      if (imageFile && imageFile.startsWith('blob:')) {
        URL.revokeObjectURL(imageFile);
      }
    };
  }, [imageFile]);

  const profileData = meQuery.data?.data.profile;
  const currentImage =
    imageFile ?? profileData?.avatarUrl ?? '/images/profile-picture.png';

  return (
    <div className='relative'>
      {/* Mobile Back */}
      <div className='absolute top-0 z-20 flex h-[64px] w-full items-center justify-between border-b border-neutral-900 bg-black px-4 md:hidden'>
        <Link
          href={`/profile/${profileData?.username}`}
          className='flex items-center gap-3'
        >
          <ArrowLeft className='size-[24px]' />
          <span className='text-md font-bold'>Edit Profile</span>
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

      <div className='mx-auto w-full max-w-[847px] px-4 py-20 md:py-[120px]'>
        <div className='flex flex-col gap-[32px]'>
          {/* Desktop Back */}
          <Link
            href={`/profile/${profileData?.username}`}
            className='hidden cursor-pointer items-center gap-3 md:flex'
          >
            <ArrowLeft className='size-[32px]' />
            <span className='text-display-xs font-bold'>Edit Profile</span>
          </Link>

          <div className='flex flex-col items-center justify-center gap-4 md:flex-row md:items-start md:justify-start md:gap-12'>
            {/* Profile Section */}
            <div
              className='relative flex flex-col items-center justify-center gap-4'
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                onChange={handleImageChange}
                disabled={patchMeMutation.isPending}
                className='absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0'
              />
              <Image
                src={currentImage}
                alt={profileData?.name ?? 'User Profile Picture'}
                height={130}
                width={130}
                className='size-20 rounded-full md:size-[130px]'
                priority
              />
              <Button
                onClick={handleTriggerFileInput}
                variant='transparant'
                className='w-[160px] font-bold'
                disabled={patchMeMutation.isPending}
              >
                Change Photo
              </Button>
            </div>

            {/* Form Section */}
            <div className='flex w-full max-w-[400px] flex-col items-center gap-4 md:max-w-none md:gap-6'>
              <div className='flex w-full flex-col gap-[2px]'>
                {/* Name */}
                <span className='font-bold md:text-sm'>Name</span>
                <Input
                  type='text'
                  placeholder='Enter your name'
                  value={name}
                  disabled={patchMeMutation.isPending}
                  onChange={(e) => setName(e.currentTarget.value)}
                  className='h-12 w-full rounded-[12px] border border-neutral-900 bg-neutral-950'
                />
                {errors.name && (
                  <span className='text-accent-red font-medium'>
                    {errors.name}
                  </span>
                )}
              </div>

              {/* Username */}
              <div className='flex w-full flex-col gap-[2px]'>
                <span className='font-bold md:text-sm'>Username</span>
                <Input
                  type='text'
                  placeholder='Enter your username'
                  value={username}
                  disabled={patchMeMutation.isPending}
                  onChange={(e) => setUsername(e.currentTarget.value)}
                  className='h-12 w-full rounded-[12px] border border-neutral-900 bg-neutral-950'
                />
                {errors.username && (
                  <span className='text-accent-red font-medium'>
                    {errors.username}
                  </span>
                )}
              </div>

              {/* Email (readonly) */}
              <div className='flex w-full flex-col gap-[2px]'>
                <span className='font-bold md:text-sm'>Email</span>
                <Input
                  type='email'
                  placeholder='Enter your email'
                  readOnly
                  value={profileData?.email ?? ''}
                  disabled={patchMeMutation.isPending}
                  className='h-12 w-full rounded-[12px] border border-neutral-900 bg-neutral-950 text-neutral-400 focus-visible:border-0'
                />
              </div>

              {/* Phone Number */}
              <div className='flex w-full flex-col gap-[2px]'>
                <span className='font-bold md:text-sm'>Phone Number</span>
                <Input
                  type='tel'
                  placeholder='Enter your phone number'
                  value={phone}
                  disabled={patchMeMutation.isPending}
                  onChange={(e) => setPhone(e.currentTarget.value)}
                  className='h-12 w-full rounded-[12px] border border-neutral-900 bg-neutral-950'
                />
                {errors.phone && (
                  <span className='text-accent-red font-medium'>
                    {errors.phone}
                  </span>
                )}
              </div>

              {/* Bio */}
              <div className='flex w-full flex-col gap-[2px]'>
                <span className='font-bold md:text-sm'>Bio</span>
                <Input
                  type='text'
                  placeholder='Enter your bio'
                  value={bio}
                  disabled={patchMeMutation.isPending}
                  onChange={(e) => setBio(e.currentTarget.value)}
                  className='h-12 w-full rounded-[12px] border border-neutral-900 bg-neutral-950'
                />
              </div>

              <Button
                type='button'
                onClick={handleSave}
                disabled={patchMeMutation.isPending}
              >
                {patchMeMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;

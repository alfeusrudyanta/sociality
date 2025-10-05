'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import useAuth from '@/hooks/queries/useAuth';
import { cn } from '@/lib/utils';
import UserSchema, { UserInput } from '@/schemas/userSchema';

const Register = () => {
  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [errors, setErrors] = useState<
    Partial<Record<keyof UserInput, string>>
  >({});

  const router = useRouter();
  const { registerMutation } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = UserSchema.safeParse({
      name,
      username,
      email,
      phone,
      password,
      newPassword,
    });

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof UserInput, string>> = {};
      result.error.issues.forEach((issues) => {
        if (issues.path[0]) {
          fieldErrors[issues.path[0] as keyof UserInput] = issues.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    const { newPassword: confirmPassowrd, ...dataToSend } = result.data;

    if (dataToSend.password !== confirmPassowrd) {
      return toast.error('Password must be matched', {
        style: {
          background: '#d9206e',
          color: 'white',
          borderRadius: '10px',
          height: '40px',
          border: 'none',
          margin: '70px 0px 0px 0px',
        },
      });
    }

    registerMutation.mutate(dataToSend, {
      onSuccess: () => {
        toast.success('Success Register', {
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
        toast.error(`Failed to register: ${registerMutation.error?.message}`, {
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
    });
  };

  return (
    <div
      className='mx-auto flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat'
      style={{ backgroundImage: "url('/images/auth-background.svg')" }}
    >
      <form
        onSubmit={handleSubmit}
        className='mx-6 my-10 flex w-full max-w-[450px] flex-col gap-4 rounded-[16px] border border-neutral-900 bg-black/20 px-4 py-[32px] backdrop-blur-[40px] md:gap-6 md:px-6 md:py-10'
      >
        {/* Logo */}
        <div className='flex items-center justify-center gap-[11px]'>
          <Image
            src='/icons/logo.svg'
            alt='Social Media Logo'
            height={30}
            width={30}
          />
          <span className='md:text-display-xs text-xl font-bold'>
            Sociality
          </span>
        </div>

        {/* Register */}
        <span className='md:text-display-xs text-center text-xl font-bold'>
          Register
        </span>

        {/* Data */}
        <div className='flex flex-col gap-4 md:gap-6'>
          <div className='flex w-full flex-col gap-[2px]'>
            <span className='font-bold md:text-sm'>Name</span>
            <Input
              type='text'
              placeholder='Enter your name'
              value={name}
              disabled={registerMutation.isPending}
              onChange={(e) => setName(e.currentTarget.value)}
              className={cn(
                'h-12 rounded-[12px] border bg-neutral-950 font-semibold',
                errors.name ? 'border-accent-red' : 'border-neutral-900'
              )}
            />
            {errors.name && (
              <span className='text-accent-red font-medium'>{errors.name}</span>
            )}
          </div>

          <div className='flex w-full flex-col gap-[2px]'>
            <span className='font-bold md:text-sm'>Username</span>
            <Input
              type='text'
              placeholder='Enter your username'
              value={username}
              disabled={registerMutation.isPending}
              onChange={(e) => setUsername(e.currentTarget.value)}
              className={cn(
                'h-12 rounded-[12px] border bg-neutral-950 font-semibold',
                errors.username ? 'border-accent-red' : 'border-neutral-900'
              )}
            />
            {errors.username && (
              <span className='text-accent-red font-medium'>
                {errors.username}
              </span>
            )}
          </div>

          <div className='flex w-full flex-col gap-[2px]'>
            <span className='font-bold md:text-sm'>Email</span>
            <Input
              type='text'
              placeholder='Enter your email'
              value={email}
              disabled={registerMutation.isPending}
              onChange={(e) => setEmail(e.currentTarget.value)}
              className={cn(
                'h-12 rounded-[12px] border bg-neutral-950 font-semibold',
                errors.email ? 'border-accent-red' : 'border-neutral-900'
              )}
            />
            {errors.email && (
              <span className='text-accent-red font-medium'>
                {errors.email}
              </span>
            )}
          </div>

          <div className='flex w-full flex-col gap-[2px]'>
            <span className='font-bold md:text-sm'>Phone Number</span>
            <Input
              type='tel'
              placeholder='Enter your phone number'
              value={phone}
              disabled={registerMutation.isPending}
              onChange={(e) => setPhone(e.currentTarget.value)}
              className={cn(
                'h-12 rounded-[12px] border bg-neutral-950 font-semibold',
                errors.phone ? 'border-accent-red' : 'border-neutral-900'
              )}
            />
            {errors.phone && (
              <span className='text-accent-red font-medium'>
                {errors.phone}
              </span>
            )}
          </div>

          <div className='flex w-full flex-col gap-[2px]'>
            <span className='font-bold md:text-sm'>Password</span>
            <Input
              type='password'
              placeholder='Enter your password'
              value={password}
              disabled={registerMutation.isPending}
              onChange={(e) => setPassword(e.currentTarget.value)}
              className={cn(
                'h-12 rounded-[12px] border bg-neutral-950 font-semibold',
                errors.password ? 'border-accent-red' : 'border-neutral-900'
              )}
            />
            {errors.password && (
              <span className='text-accent-red font-medium'>
                {errors.password}
              </span>
            )}
          </div>

          <div className='flex w-full flex-col gap-[2px]'>
            <span className='font-bold md:text-sm'>Confirm Password</span>
            <Input
              type='password'
              placeholder='Enter your confirm password'
              value={newPassword}
              disabled={registerMutation.isPending}
              onChange={(e) => setNewPassword(e.currentTarget.value)}
              className={cn(
                'h-12 rounded-[12px] border bg-neutral-950 font-semibold',
                errors.newPassword ? 'border-accent-red' : 'border-neutral-900'
              )}
            />
            {errors.newPassword && (
              <span className='text-accent-red font-medium'>
                {errors.newPassword}
              </span>
            )}
          </div>

          <Button
            type='submit'
            disabled={registerMutation.isPending}
            className='text-md h-11 font-bold'
          >
            {registerMutation.isPending ? 'Registering...' : 'Register'}
          </Button>

          <span className='text-center font-semibold'>
            Already have an account?{' '}
            <Link href='/login'>
              <span className='text-primary-200'>Login</span>
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Register;

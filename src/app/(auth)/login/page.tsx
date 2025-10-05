'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';
import z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import useAuth from '@/hooks/queries/useAuth';
import { cn } from '@/lib/utils';
import UserSchema from '@/schemas/userSchema';

const LoginSchema = UserSchema.pick({ email: true, password: true });
type LoginInput = z.infer<typeof LoginSchema>;

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginInput, string>>
  >({});

  const router = useRouter();
  const { loginMutation } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = LoginSchema.safeParse({ email, password });

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginInput, string>> = {};
      result.error.issues.forEach((issues) => {
        if (issues.path[0]) {
          fieldErrors[issues.path[0] as keyof LoginInput] = issues.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    loginMutation.mutate(result.data, {
      onSuccess: () => {
        toast.success('Success Login', {
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
        toast.error('Invalid Email/Password', {
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
        className='mx-6 flex w-full max-w-[450px] flex-col gap-4 rounded-[16px] border border-neutral-900 bg-black/20 px-4 py-[32px] backdrop-blur-[40px] md:gap-6 md:px-6 md:py-10'
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

        {/* Welcome */}
        <span className='md:text-display-xs text-center text-xl font-bold'>
          Welcome Back!
        </span>

        {/* Data */}
        <div className='flex flex-col gap-4 md:gap-6'>
          <div className='flex w-full flex-col gap-[2px]'>
            <span className='font-bold md:text-sm'>Email</span>
            <Input
              type='email'
              placeholder='Enter your email'
              value={email}
              disabled={loginMutation.isPending}
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
            <span className='font-bold md:text-sm'>Password</span>
            <Input
              type='password'
              placeholder='Enter your password'
              value={password}
              disabled={loginMutation.isPending}
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

          <Button
            type='submit'
            disabled={loginMutation.isPending}
            className='text-md h-11 font-bold'
          >
            {loginMutation.isPending ? 'Logging in...' : 'Login'}
          </Button>

          <span className='text-center font-semibold'>
            Don&apos;t have an account?{' '}
            <Link href='/register'>
              <span className='text-primary-200'>Register</span>
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;

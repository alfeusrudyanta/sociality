'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import clsx from 'clsx';
import './globals.css';
import localFont from 'next/font/local';
import { Provider } from 'react-redux';

import { Toaster } from '@/components/ui/sonner';

import { store } from '@/features/store';

const sfPro = localFont({
  src: [
    {
      path: '../fonts/SFPro/SF-Pro-Text-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/SFPro/SF-Pro-Text-RegularItalic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../fonts/SFPro/SF-Pro-Text-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/SFPro/SF-Pro-Text-Semibold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../fonts/SFPro/SF-Pro-Text-Bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-sfpro',
  display: 'swap',
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <body
            className={clsx(
              sfPro.variable,
              'md:text-md text-neutral-25 font-regular min-h-screen bg-black text-sm antialiased'
            )}
          >
            {children}
            <Toaster position='top-right' />
          </body>
        </QueryClientProvider>
      </Provider>
    </html>
  );
}

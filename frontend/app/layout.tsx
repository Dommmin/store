import { Lusitana } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import React from 'react';

const lusitana = Lusitana({ subsets: ['latin'], weight: ['400', '700'] });

const { SITE_NAME } = process.env;

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
   ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
   : 'http://localhost:3000';

export const metadata = {
   metadataBase: new URL(baseUrl),
   title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
   },
   robots: {
      follow: true,
      index: true,
   },
   icons: {
      icon: '/icons/icon-192x192.png',
      apple: '/icons/icon-192x192.png',
   },
   manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
   return (
      <html lang="en" className={lusitana.className}>
         <head>
            <link rel="manifest" href="/manifest.json" />
            <link rel="icon" href="/icons/icon-192x192.png" />
            <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
            <meta name="theme-color" content="#000000" />
            <title>{metadata.title.default}</title>
         </head>
         <body className="min-h-screen bg-base-100 text-black selection:bg-teal-300 dark:text-white dark:selection:bg-cyan-800 dark:selection:text-white">
            <main>
               <Providers>{children}</Providers>
            </main>
         </body>
      </html>
   );
}

import { Lusitana } from 'next/font/google';
import './globals.css';

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
};

export default function RootLayout({ children }) {
   return (
      <html lang="en" className={lusitana.className}>
         <body className="min-h-screen bg-base-100 text-black selection:bg-teal-300  dark:text-white dark:selection:bg-cyan-800 dark:selection:text-white">
            <main>{children}</main>
         </body>
      </html>
   );
}

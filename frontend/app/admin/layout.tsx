'use client';

import { useState } from 'react';
import Sidebar from './components/Sidebar';
import useAuth from '../hooks/auth';
import PageNotFound from '../not-found';

export default function AdminLayout({ children }) {
   const [isOpen, setIsOpen] = useState(true);

   const { user, isPending } = useAuth();

   if (isPending) return null;
   if (!user?.is_admin) return <PageNotFound />;

   return (
      <div>
         <div className={`flex h-full overflow-hidden ${isOpen ? 'md:ml-[250px]' : ''}`}>
            <div className="z-10 w-full bg-base-200 text-white">
               <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>
         </div>
         <div className={`flex-grow ${isOpen ? 'md:ml-[250px]' : ''}`}>{children}</div>
      </div>
   );
}

'use client';

import { useState } from 'react';
import Sidebar from './components/Sidebar';

export default function Layout({ children }) {
   const [isOpen, setIsOpen] = useState(true);

   return (
      <div>
         <div className={`flex h-full overflow-hidden ${isOpen ? 'md:ml-[250px]' : ''}`}>
            <div className="w-full bg-base-200 text-white z-10">
               <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>
         </div>
         <div className={`flex-grow ${isOpen ? 'md:ml-[250px]' : ''}`}>{children}</div>
      </div>
   );
}

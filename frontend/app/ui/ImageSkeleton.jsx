import React from 'react';

export default function ImageSkeleton() {
   return (
      <div className="bg-white dark:bg-base-100 rounded-lg shadow p-4 flex space-x-4 animate-pulse">
         <div className="bg-base-300 w-24 h-24 rounded-xl"></div>
         <div className="flex-1 min-w-0 mt-1 space-y-1 pr-4">
            <div className="bg-base-200 h-6 max-w-lg rounded-xl" />
            <div className="bg-base-200 w-16 lg:w-24 h-6 rounded-xl" />
         </div>
         <div className="relative">
            <div className="bg-base-200 w-7 h-7 rounded-lg absolute -top-2 -right-2 z-10 text-white" />
         </div>
      </div>
   );
}

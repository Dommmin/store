import React from 'react';

export default function ImageSkeleton() {
   return (
      <div className="flex animate-pulse space-x-4 rounded-lg bg-white p-4 shadow dark:bg-base-100">
         <div className="h-24 w-24 rounded-xl bg-base-300" />
         <div className="mt-1 min-w-0 flex-1 space-y-1 pr-4">
            <div className="h-6 max-w-lg rounded-xl bg-base-200" />
            <div className="h-6 w-16 rounded-xl bg-base-200 lg:w-24" />
         </div>
         <div className="relative">
            <div className="absolute -right-2 -top-2 z-10 h-7 w-7 rounded-lg bg-base-200 text-white" />
         </div>
      </div>
   );
}

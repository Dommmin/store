import React from 'react';

export default function ProductSkeleton() {
   const items = [];

   const skeleton = (
      <div className="flex flex-col gap-4 max-w-xl">
         <div className="skeleton h-32 w-full"></div>
         <div className="skeleton h-4 w-28"></div>
         <div className="skeleton h-4 w-full"></div>
         <div className="skeleton h-4 w-full"></div>
      </div>
   );

   for (let i = 0; i < 20; i++) {
      items.push(skeleton);
   }

   return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 min-[1920px]:grid-cols-4 min-[3440px]:grid-cols-5 gap-8">
         {items}
      </div>
   );
}

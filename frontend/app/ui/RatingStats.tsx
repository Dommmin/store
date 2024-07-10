import React from 'react';
import { StarIcon } from '@heroicons/react/24/outline';

const RatingStats = ({ ratings, averageRating = 0, ratingsCount = 0, className = '' }) => {
   const totalRatings = ratings.reduce((total, num) => total + num);

   return (
      <div className={className}>
         <div className="bg-dark-500 mx-auto flex grid w-full grid-cols-2 items-center space-x-4 rounded-xl p-4 text-white">
            <div className="flex justify-center">
               <div className="text-center">
                  <p className="text-2xl font-bold">{averageRating}/5</p>
                  <div className="flex">
                     {Array.from({ length: 5 }, (_, i) => (
                        <StarIcon
                           key={i}
                           className="h-5"
                           color={i < Math.round(averageRating) ? '#fcc419' : 'gray'}
                           fill={i < Math.round(averageRating) ? '#fcc419' : 'gray'}
                        />
                     ))}
                  </div>
                  <p className="text-gray-400">({ratingsCount} reviews)</p>
               </div>
            </div>
            <div className="space-y-2">
               {ratings.map((rating, i) => (
                  <div key={i} className="flex items-center space-x-2">
                     <div className="flex space-x-1">
                        <p>★</p>
                        <p>{5 - i}</p>
                     </div>
                     <div className="h-2 w-full overflow-hidden rounded-full bg-gray-700">
                        <div style={{ width: `${(rating / totalRatings) * 100}%` }} className="h-full bg-yellow-500" />
                     </div>
                     <div className="flex justify-start" style={{ width: '30px', textAlign: 'right' }}>
                        {rating}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

export default RatingStats;

'use client';

import Wrapper from '../../../../ui/Wrapper';
import React, { useEffect, useState } from 'react';
import axios from '../../../../lib/axios';
import LoadingSpinner from '../../../../ui/LoadingSpinner';
import Image from 'next/image';
import { StarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Variants({ params }) {
   const [variants, setVariants] = useState([]);
   const [isLoading, setIsLoading] = useState(true);

   const fetchVariants = () => {
      axios
         .get('/api/v1/products/' + params.id + '/variants')
         .then((response) => {
            setVariants(response.data.data);
         })
         .catch((error) => {
            console.log(error);
         })
         .finally(() => setIsLoading(false));
   };

   useEffect(() => {
      fetchVariants();
   }, []);

   if (isLoading) return <LoadingSpinner className="h-screen" />;

   console.log(variants);

   return (
      <Wrapper>
         <div className="space-y-4">
            {variants.map((variant) => (
               <div
                  className="w-full bg-base-200 border border-neutral-200 dark:border-neutral-700 rounded-lg relative"
                  key={variant.id}
               >
                  <Link
                     href={'/p/' + variant.id}
                     className="flex flex-col sm:flex-row space-x-0 space-y-2 sm:space-x-4 sm:space-y-0 p-4"
                  >
                     <Image
                        className="rounded-lg w-full sm:w-1/4"
                        layout="cover"
                        src={variant.main_image}
                        alt={variant.name}
                        width={400}
                        height={400}
                     />
                     <div>
                        <p>{variant.name}</p>
                        <div>
                           <div className="flex items-center">
                              {Array.from({ length: 5 }, (_, i) => (
                                 <StarIcon
                                    key={i}
                                    className="h-5"
                                    color={i < Math.round(variant.reviews_avg_rating) ? '#fcc419' : 'gray'}
                                    fill={i < Math.round(variant.reviews_avg_rating) ? '#fcc419' : 'gray'}
                                 />
                              ))}
                              <p className="pl-1">({variant.reviews_count})</p>
                           </div>
                        </div>
                        {variant.attributes.map((attribute) => (
                           <div key={attribute.id}>
                              {attribute.name}: {attribute.value}
                           </div>
                        ))}
                     </div>
                  </Link>
                  <div className="absolute bottom-4 right-4 bg-info px-4 py-2 rounded-3xl mt-2">
                     ${variant.formatted_price}
                  </div>
               </div>
            ))}
         </div>
      </Wrapper>
   );
}

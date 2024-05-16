'use client';

import Wrapper from '../../ui/Wrapper';
import axios from '../../lib/axios';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../../ui/LoadingSpinner';
import Link from 'next/link';
import Image from 'next/image';

const Page = () => {
   const [data, setData] = useState([]);
   const [isLoading, setIsLoading] = useState(true);

   const fetchProducts = () => {
      axios
         .get('/api/v1/bookmarks')
         .then((response) => {
            setData(response.data);
         })
         .catch((error) => {
            console.error('Error:', error);
         })
         .finally(() => setIsLoading(false));
   };

   useEffect(() => {
      fetchProducts();
   }, []);

   if (isLoading) {
      return (
         <Wrapper>
            <LoadingSpinner />
         </Wrapper>
      );
   }

   return (
      <Wrapper>
         {!data.length && <p>No bookmarks yet...</p>}
         <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.map((bookmark) => (
               <li key={bookmark.id}>
                  <Link
                     className="flex max-w-xs space-x-2 border border-neutral-200 dark:border-neutral-700 p-4 bg-base-100 rounded-xl"
                     href={`/p/${bookmark.product.url}`}
                  >
                     <Image
                        className="rounded-xl"
                        src={bookmark.product.main_image}
                        alt={bookmark.product.name}
                        width={100}
                        height={100}
                     />
                     <p>{bookmark.product.name}</p>
                  </Link>
               </li>
            ))}
         </ul>
      </Wrapper>
   );
};

export default Page;

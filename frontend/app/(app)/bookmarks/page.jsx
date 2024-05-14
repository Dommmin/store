'use client';

import Wrapper from '../../ui/Wrapper';
import axios from '../../lib/axios';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../../ui/LoadingSpinner';
import Link from 'next/link';

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
         <ul>
            {data.map((bookmark) => (
               <li key={bookmark.id}>
                  <Link href={`/p/${bookmark.product.id}`}>{bookmark.product.name}</Link>
               </li>
            ))}
         </ul>
      </Wrapper>
   );
};

export default Page;

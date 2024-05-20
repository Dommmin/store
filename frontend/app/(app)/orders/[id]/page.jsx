'use client';

import Wrapper from '../../../ui/Wrapper';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../../../ui/LoadingSpinner';
import axios from '../../../lib/axios';
import Image from 'next/image';
import Link from 'next/link';

export default function Order({ params }) {
   const [order, setOrder] = useState({});
   const [isLoading, setIsLoading] = useState(true);

   const fetchOrder = () => {
      axios
         .get('/api/v1/orders/' + params.id)
         .then((response) => {
            setOrder(response.data.data);
         })
         .catch((error) => {
            console.error(error);
         })
         .finally(() => setIsLoading(false));
   };

   useEffect(() => {
      fetchOrder();
   }, []);

   if (isLoading) return <LoadingSpinner className="h-screen" />;

   return (
      <Wrapper>
         <div className="space-y-4">
            {order.items.map((item) => (
               <Link
                  href={`/p/${item.product.url}`}
                  key={item.id}
                  className="flex space-x-4 rounded-xl border border-neutral-200 bg-base-100 p-4 dark:border-neutral-700"
               >
                  <Image
                     className="rounded-xl"
                     src={item.product.main_image}
                     alt={item.product.name}
                     width={150}
                     height={150}
                  />
                  <div className="flex w-full flex-col justify-between">
                     <div>{item.product.name}</div>
                     <div />
                     <div className="flex justify-between">
                        <div>Quantity: {item.quantity}</div>
                        <div>{item.product.formatted_price} zł</div>
                     </div>
                  </div>
               </Link>
            ))}
         </div>
      </Wrapper>
   );
}

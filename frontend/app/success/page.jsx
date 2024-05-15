'use client';

import Wrapper from '../ui/Wrapper';
import { useSearchParams } from 'next/navigation';
import PageNotFound from '../not-found';
import axios from '../lib/axios';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/auth';
import Link from 'next/link';

export default function Success() {
   const [order, setOrder] = useState({});
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState(false);
   const searchParams = useSearchParams();
   const sessionId = searchParams.get('session_id');

   const { isFetching } = useAuth();

   if (!sessionId) {
      return <PageNotFound />;
   }

   const fetchOrder = async () => {
      try {
         const response = await axios.post('/api/v1/confirmation', {
            session_id: sessionId,
         });
         setOrder(response.data);
      } catch (error) {
         if (error.response.status === 404) {
            setError(true);
         }
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      fetchOrder();
   }, [isFetching]);

   if (isLoading || isFetching) return;
   if (error) return <PageNotFound />;

   return (
      <div className="h-screen flex justify-center items-center text-center">
         <Wrapper className="px-24 sm:px-32">
            <h1 className="text-xl mb-2">Your order has been confirmed!</h1>
            <Link href="/" className="btn btn-info text-white">
               Back to homepage
            </Link>
         </Wrapper>
      </div>
   );
}

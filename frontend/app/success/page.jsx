'use client';

import Wrapper from '../../ui/Wrapper';
import {useSearchParams} from 'next/navigation';
import PageNotFound from '../../not-found';
import axios from '../../lib/axios';
import {useEffect, useState} from 'react';

export default function Success() {
    const [order, setOrder] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
        return <PageNotFound />
    }

    const fetchOrder = async () => {
        try {
            const response = await axios.post('/api/v1/confirmation', {
                sessionId
            });
            setIsLoading(false);
            setOrder(response.data);
        } catch (error) {
            if (error.response.status === 404) {
                setError(true);
            }
        }
    }

    useEffect(() => {
        fetchOrder();
    }, []);

    if (error) return <PageNotFound />
    if (isLoading) return;

    console.log(order);

   return (
      <Wrapper>
         <h1>Success</h1>
      </Wrapper>
   );
}

'use client';

import React, { useEffect, useState } from 'react';
import axios from '../../lib/axios';
import { motion } from 'framer-motion';
import OrderItem from '../../ui/Order';
import Wrapper from '../../ui/Wrapper';

export default function Orders() {
   const [orders, setOrders] = useState([]);
   const [isLoading, setIsLoading] = useState(true);

   const fetchOrders = () => {
      axios
         .get('/api/v1/orders')
         .then((response) => {
            setOrders(response.data);
         })
         .catch((error) => {
            console.error(error);
         })
         .finally(() => setIsLoading(false));
   };

   const variants = {
      hidden: { opacity: 0 },
      show: {
         opacity: 1,
         transition: {
            staggerChildren: 0.1,
         },
      },
   };

   useEffect(() => {
      fetchOrders();
   }, []);

   if (isLoading) return;

   return (
      <Wrapper>
         <motion.div className="grid gap-4" variants={variants} initial="hidden" animate="show">
            {orders.data.map((order) => (
               <OrderItem key={order.id} order={order} />
            ))}
         </motion.div>
      </Wrapper>
   );
}

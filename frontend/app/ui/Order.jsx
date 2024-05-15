import { motion } from 'framer-motion';
import React from 'react';
import Link from 'next/link';

export default function Order({ order }) {
   const variants = {
      hidden: { opacity: 0 },
      show: {
         opacity: 1,
         transition: {
            staggerChildren: 0.1,
         },
      },
   };

   return (
      <Link href={`/orders/${order.id}`}>
         <motion.div
            variants={variants}
            className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 bg-base-100"
         >
            <div className="flex justify-between space-x-2 items-center">
               <div>{order.uuid}</div>
               <div>{order.created_at}</div>
            </div>
            <div className="flex space-x-2 mt-2">{order.total} zł</div>
            <div className="w-full max-w-4xl text-sm tracking-wide mt-4">Items: {order.items_count}</div>
         </motion.div>
      </Link>
   );
}

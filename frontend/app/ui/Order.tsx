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
            className="rounded-xl border border-neutral-200 bg-base-100 p-4 dark:border-neutral-700"
         >
            <div className="flex items-center justify-between space-x-2">
               <div>{order.uuid}</div>
               <div>{order.created_at}</div>
            </div>
            <div className="mt-2 flex space-x-2">{order.total} zł</div>
            <div className="mt-4 w-full max-w-4xl text-sm tracking-wide">Items: {order.items_count}</div>
         </motion.div>
      </Link>
   );
}

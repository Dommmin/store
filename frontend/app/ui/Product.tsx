import Image from 'next/image';
import { motion } from 'framer-motion';
import React from 'react';

export default function Product({ product, className = '' }) {
   return (
      <motion.div
         animate={{ opacity: 1 }}
         initial={{ opacity: 0 }}
         exit={{ opacity: 0 }}
         layout
         className={
            'border-natural-200 relative max-w-xl overflow-hidden rounded-lg border dark:border-neutral-700 ' +
            className
         }
      >
         <Image
            className="h-64 w-full object-cover transition-all duration-200"
            src={product.main_image}
            alt={product.name}
            width={800}
            height={800}
            priority={true}
         />
         <div className="bg-base-100 px-6 py-4">
            <div className="mb-2 text-xl font-bold">{product.name}</div>
            <p className="text-neutral-600 dark:text-neutral-400">${product.formatted_price}</p>
         </div>
      </motion.div>
   );
}

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
            'relative max-w-xl rounded-lg overflow-hidden border border-natural-200 dark:border-neutral-700 ' +
            className
         }
      >
         <Image
            className="w-full h-64 object-cover transition-all duration-200"
            src={product.main_image}
            alt={product.name}
            width={800}
            height={800}
         />
         <div className="px-6 py-4 bg-base-100">
            <div className="font-bold text-xl mb-2">{product.name}</div>
            <p className="text-neutral-600 dark:text-neutral-400">${product.formatted_price}</p>
         </div>
      </motion.div>
   );
}

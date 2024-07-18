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
            'border-natural-200 relative h-64 max-w-xl overflow-hidden rounded-lg border dark:border-neutral-700 ' +
            className
         }
      >
         <Image
            fill
            loading="lazy"
            blurDataURL={product.main_image}
            placeholder="blur"
            className="object-cover transition-all duration-200"
            src={product.main_image}
            alt={product.name}
            quality={50}
            sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
         />
         <div className="bg-base-100 px-6 py-4">
            <div className="mb-2 text-xl font-bold">{product.name}</div>
            <p className="text-neutral-600 dark:text-neutral-400">${product.formatted_price}</p>
         </div>
      </motion.div>
   );
}

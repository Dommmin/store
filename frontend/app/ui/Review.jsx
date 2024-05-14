import Image from 'next/image';
import { StarIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function Review({ review }) {
   const variants = {
      hidden: { opacity: 0 },
      show: { opacity: 1 },
   };

   return (
      <motion.div
         variants={variants}
         className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 bg-base-100"
      >
         <div className="flex space-x-2 items-center">
            <Image
               src={review.user.profile_photo_url}
               alt={review.title}
               width={50}
               height={50}
               className="rounded-full w-10 h-10"
               objectFit="cover"
               layout="fixed"
               priority
               blurDataURL={review.user.profile_photo_url}
               placeholder="blur"
            />
            <div className="flex flex-col">
               <p className="text-sm">{review.user.name}</p>
               <p className="label-text">{review.confirmed_purchase ? 'Purchase Confirmed ✅' : ''}</p>
            </div>
         </div>
         <div className="flex space-x-2 mt-2">
            <div className="flex">
               {Array.from({ length: 5 }, (_, i) => (
                  <StarIcon
                     key={i}
                     className="h-5"
                     color={i < review.rating ? '#fcc419' : 'gray'}
                     fill={i < review.rating ? '#fcc419' : 'gray'}
                  />
               ))}
            </div>
            <div>{review.created_at}</div>
         </div>
         <div className="w-full max-w-4xl text-sm tracking-wide mt-4">
            <h1 className="text-xl font-bold">{review.title}</h1>
            {review.body}
         </div>
         {review.image && (
            <div>
               <Image src={review.image} alt={review.title} width={100} height={100} className="rounded-xl mt-4" />
            </div>
         )}
      </motion.div>
   );
}

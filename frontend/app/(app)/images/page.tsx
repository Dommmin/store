'use client';

import Wrapper from '../../ui/Wrapper';
import axios from '../../lib/axios';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const Images = () => {
   const [images, setImages] = useState([]);
   const [isPending, setIsPending] = useState(true);

   const fetchImages = () => {
      axios
         .get('/api/v1/images')
         .then((response) => {
            setImages(response.data);
         })
         .catch((error) => {
            console.error('Error:', error);
         })
         .finally(() => setIsPending(false));
   };

   useEffect(() => {
      fetchImages();
   }, []);

   if (isPending) {
      return;
   }

   return (
      <Wrapper>
         <div className="columns-1 gap-4 gap-4 space-y-4 sm:columns-2 xl:columns-3 2xl:columns-4">
            {images.map((image, index) => (
               <Image
                  className="h-96 transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
                  key={image.id}
                  src={image.path}
                  alt={`Slide ${index + 1}`}
                  placeholder="blur"
                  blurDataURL={image.path}
                  style={{
                     objectFit: 'cover', // cover, contain, none
                  }}
                  width={720}
                  height={480}
                  sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
               />
            ))}
         </div>
      </Wrapper>
   );
};

export default Images;

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ImageSkeleton from '../ui/ImageSkeleton';

const UploadItem = ({ image, onRemove }) => {
   const [imagePreview, setImagePreview] = useState('');

   useEffect(() => {
      const reader = new FileReader();
      reader.onloadend = () => {
         setImagePreview(reader.result);
      };
      reader.readAsDataURL(image);
   }, [image]);

   if (!imagePreview) return <ImageSkeleton />;

   return (
      <>
         <div className="bg-white dark:bg-base-100 rounded-lg shadow p-4 flex space-x-4">
            <Image
               className="h-24 w-24 object-cover rounded-lg"
               src={imagePreview}
               width={100}
               height={100}
               alt={image.name}
               layout="fixed"
               objectFit="cover"
               quality={100}
               priority
               placeholder="blur"
               blurDataURL={imagePreview}
               onLoadingComplete={() => setImagePreview(imagePreview)}
            />
            <div className="flex-1 min-w-0 mt-1">
               <h2 className="text-lg font-medium dark:text-gray-300 text-gray-900 text-ellipsis overflow-hidden">
                  {image.name}
               </h2>
               <p className="text-sm text-gray-500">{(image.size / 1024).toFixed(2)} KB</p>
            </div>
            <div className="relative">
               <button
                  onClick={onRemove}
                  className="btn btn-square btn-error btn-xs absolute -top-2 -right-2 z-10 text-white"
               >
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     className="h-4 w-4"
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke="currentColor"
                  >
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
               </button>
            </div>
         </div>
      </>
   );
};

export default UploadItem;

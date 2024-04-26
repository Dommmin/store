import React, { useEffect, useState } from 'react';

const UploadItem = ({ image, onRemove }) => {
   const [imagePreview, setImagePreview] = useState('');

   useEffect(() => {
      const reader = new FileReader();
      reader.onloadend = () => {
         setImagePreview(reader.result);
      };
      reader.readAsDataURL(image);
   }, [image]);

   return (
      <div className="bg-white rounded-lg shadow p-4 flex space-x-4">
         <img className="h-24 w-24 object-cover rounded-lg" src={imagePreview} alt={image.name} loading="lazy" />
         <div className="flex-1 min-w-0 mt-1">
            <h2 className="text-lg font-medium text-gray-900 text-ellipsis overflow-hidden">{image.name}</h2>
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
   );
};

export default UploadItem;

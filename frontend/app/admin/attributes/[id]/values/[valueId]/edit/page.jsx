'use client';

import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../../../../../../ui/LoadingSpinner';
import axios from '../../../../../../lib/axios';
import { useRouter } from 'next/navigation';
import Wrapper from '../../../../../../ui/Wrapper';
import InputError from '../../../../../../ui/InputError';

export default function AttributeValueEdit({ params }) {
   const router = useRouter();
   const [name, setName] = useState('');
   const [errors, setErrors] = useState([]);
   const [attributeValue, setAttributeValue] = useState({});
   const [isLoading, setIsLoading] = useState(true);

   const fetchAttributeValue = () => {
      axios
         .get('/api/v1/admin/attributes/' + params.id + '/attributeValues/' + params.valueId)
         .then((response) => {
            setAttributeValue(response.data);
            setName(response.data.name);
         })
         .catch((error) => {
            console.error(error);
         })
         .finally(() => setIsLoading(false));
   };

   const handleUpdate = (event) => {
      event.preventDefault();

      setErrors([]);

      axios
         .put('/api/v1/admin/attributes/' + params.id + '/attributeValues/' + params.valueId, {
            name: name,
         })
         .then((response) => {
            // TODO: show notification
            router.push('/admin/attributes/' + params.id + '/values');
         })
         .catch((error) => {
            if (error.response.status === 422) {
               setErrors(error.response.data.errors);
            } else {
               // TODO: show notification
            }
         });
   };

   useEffect(() => {
      fetchAttributeValue();
   }, []);

   if (isLoading) return <LoadingSpinner className="h-screen" />;

   return (
      <>
         <h1 className="p-2 text-3xl font-bold">Edit {attributeValue.name}</h1>
         <Wrapper maxWidth="max-w-xl">
            <form className="flex items-center justify-center" onSubmit={handleUpdate}>
               <div className="space-y-2">
                  <input
                     className={'input input-bordered w-full ' + (errors.name ? ' input-error' : '')}
                     onChange={(e) => {
                        if (errors.name) {
                           setErrors((prevErrors) => ({ ...prevErrors, name: '' }));
                        }
                        setName(e.target.value);
                     }}
                     value={name}
                     type="text"
                     placeholder="Name"
                  />
                  <InputError messages={errors.name} className="mt-2" />
                  <button type="submit" className="btn btn-success mt-8 w-full text-white">
                     Update
                  </button>
               </div>
            </form>
         </Wrapper>
      </>
   );
}

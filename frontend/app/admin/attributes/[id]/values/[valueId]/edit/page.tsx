'use client';

import React, { useState } from 'react';
import LoadingSpinner from '../../../../../../ui/LoadingSpinner';
import axios from '../../../../../../lib/axios';
import { useRouter } from 'next/navigation';
import Wrapper from '../../../../../../ui/Wrapper';
import InputError from '../../../../../../ui/InputError';
import { ValidationErrors } from '../../../../../../types/validation-errors';
import { useQuery } from '@tanstack/react-query';

export default function AttributeValueEdit({ params }) {
   const router = useRouter();
   const [errors, setErrors] = useState<ValidationErrors>({});

   const fetchAttributeValue = async () => {
      const response = await axios.get('/api/v1/admin/attributes/' + params.id + '/attributeValues/' + params.valueId);

      return response.data;
   };

   const { data: attributeValue, isPending } = useQuery({
      queryKey: ['attributeValue'],
      queryFn: fetchAttributeValue,
   });

   const handleUpdate = (event: React.FormEvent) => {
      event.preventDefault();

      setErrors({});

      axios
         .put('/api/v1/admin/attributes/' + params.id + '/attributeValues/' + params.valueId, {
            name: attributeValue.name,
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

   if (isPending) return <LoadingSpinner className="h-screen" />;

   return (
      <>
         <h1 className="p-2 text-3xl font-bold">Edit {attributeValue.name}</h1>
         <Wrapper maxWidth="max-w-xl">
            <form className="flex items-center justify-center" onSubmit={handleUpdate}>
               <div className="space-y-2">
                  <input
                     className={'input input-bordered w-full ' + (errors.name ? ' input-error' : '')}
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

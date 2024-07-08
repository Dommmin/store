'use client';

import React, { useState } from 'react';
import LoadingSpinner from '../../../../ui/LoadingSpinner';
import axios from '../../../..//lib/axios';
import { useRouter } from 'next/navigation';
import Wrapper from '../../../../ui/Wrapper';
import InputError from '../../../../ui/InputError';
import { useQuery } from '@tanstack/react-query';
import { ValidationErrors } from '../../../../types/validation-errors';

export default function AttributeEdit({ params }) {
   const router = useRouter();
   const [name, setName] = useState('');
   const [description, setDescription] = useState('');
   const [errors, setErrors] = useState<ValidationErrors>({});

   const fetchAttribute = async () => {
      const response = await axios.get('/api/v1/admin/attributes/' + params.id);

      if (response.status === 200) {
         setName(response.data.name);
         setDescription(response.data.description);
      }

      return response.data;
   };

   const { data: attribute, isPending } = useQuery({
      queryKey: ['attribute'],
      queryFn: fetchAttribute,
   })

   const handleUpdate = (event: React.FormEvent) => {
      event.preventDefault();

      setErrors({});

      axios
         .put('/api/v1/admin/attributes/' + params.id, {
            name: name,
            description: description,
         })
         .then((response) => {
            // TODO: show notification
            router.push('/admin/attributes/');
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
         <h1 className="p-2 text-3xl font-bold">Edit {attribute.name}</h1>
         <Wrapper maxWidth="max-w-xl">
            <form className="flex items-center justify-center" onSubmit={handleUpdate}>
               <div className="space-y-2">
                  <input
                     className={'input input-bordered w-full ' + (errors.name ? ' input-error' : '')}
                     onChange={(e) => setName(e.target.value)}
                     value={name}
                     type="text"
                     placeholder="Name"
                  />
                  <InputError messages={errors.name} className="mt-2" />
                  <textarea
                     onChange={(e) => setDescription(e.target.value)}
                     rows={5}
                     value={description}
                     className="textarea textarea-bordered w-full"
                     placeholder="Description"
                  />
                  <InputError messages={errors.description} className="mt-2" />
                  <button type="submit" className="btn btn-success mt-8 w-full text-white">
                     Update
                  </button>
               </div>
            </form>
         </Wrapper>
      </>
   );
}

'use client';

import React, { useState } from 'react';
import Wrapper from '../../../ui/Wrapper';
import axios from '../../../lib/axios';
import { useRouter } from 'next/navigation';
import InputError from '../../../ui/InputError';
import { ValidationErrors } from '../../../types/validation-errors';

export default function AttributeCreate() {
   const router = useRouter();
   const [name, setName] = useState('');
   const [description, setDescription] = useState('');
   const [errors, setErrors] = useState<ValidationErrors>({});

   const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();

      setErrors({});

      axios
         .post('/api/v1/admin/attributes', {
            name: name,
            description: description,
         })
         .then((response) => {
            // TODO: show notification
            router.push('/admin/attributes');
         })
         .catch((error) => {
            if (error.response.status === 422) {
               setErrors(error.response.data.errors);
            } else {
               // TODO: show notification
            }
         });
   };

   return (
      <>
         <h1 className="p-2 text-3xl font-bold">Create Attribute</h1>
         <Wrapper maxWidth="max-w-xl">
            <form className="flex items-center justify-center" onSubmit={handleSubmit}>
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
                  <button className="btn btn-success mt-8 w-full text-white" onSubmit={handleSubmit}>
                     Submit
                  </button>
               </div>
            </form>
         </Wrapper>
      </>
   );
}

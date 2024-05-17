'use client';

import React, { useState } from 'react';
import Wrapper from '../../../ui/Wrapper';
import axios from '../../../lib/axios';
import { useRouter } from 'next/navigation';
import InputError from '../../../ui/InputError';

export default function BrandCreate() {
   const router = useRouter();
   const [name, setName] = useState('');
   const [errors, setErrors] = useState([]);

   const handleSubmit = (event) => {
      event.preventDefault();

      setErrors([]);

      axios
         .post('/api/v1/admin/brands', {
            name: name,
         })
         .then((response) => {
            // TODO: show notification
            router.push('/admin/brands');
         })
         .catch((error) => {
            if (error.response.data.status === 422) {
               setErrors(error.response.data.errors);
            } else {
               // TODO: show notification
            }
         });
   };

   return (
      <>
         <h1 className="text-3xl font-bold p-2">Create Brand</h1>
         <Wrapper maxWidth="max-w-xl">
            <form className="flex justify-center items-center" onSubmit={handleSubmit}>
               <div>
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
                  <button className="w-full btn btn-success text-white mt-4" onSubmit={handleSubmit}>
                     Submit
                  </button>
               </div>
            </form>
         </Wrapper>
      </>
   );
}

'use client';

import React, { useState } from 'react';
import Wrapper from '../../../ui/Wrapper';
import axios from '../../../lib/axios';
import { useRouter } from 'next/navigation';
import InputError from '../../../ui/InputError';
import { useForm } from 'react-hook-form';
import { Errors } from '../../../types/errors';

interface FormInput {
   name: string;
}

export default function BrandCreate() {
   const router = useRouter();
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<FormInput>();
   const [validationErrors, setValidationErrors] = useState<Errors>({});

   console.log(errors);

   const onSubmit = async (data: FormInput) => {
      setValidationErrors({});
      try {
         const response = await axios.post('/api/v1/admin/brands', {
            name: data.name,
         });

         if (response.status === 201) {
            router.push('/admin/brands');
         }

         // TODO: show notification
      } catch (error) {
         if (error.response.status === 422) {
            setValidationErrors(error.response.data.errors);
         } else {
            // Handle other errors
            // TODO: show notification
         }
      }
   };

   return (
      <>
         <h1 className="p-2 text-3xl font-bold">Create Brand</h1>
         <Wrapper maxWidth="max-w-xl">
            <form className="flex items-center justify-center" onSubmit={handleSubmit(onSubmit)}>
               <div className="form-control w-full max-w-xs">
                  <input
                     {...register('name', { required: 'Name is required' })}
                     className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                     type="text"
                     placeholder="Name"
                  />
                  {errors.name && <InputError messages={[errors.name.message]} className="mt-2" />}
                  <InputError messages={validationErrors.name} className="mt-2" />
                  <button className="btn btn-success mt-4 w-full text-white" type="submit">
                     Submit
                  </button>
               </div>
            </form>
         </Wrapper>
      </>
   );
}

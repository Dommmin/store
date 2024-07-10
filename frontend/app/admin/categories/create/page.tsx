'use client';

import React, { useState } from 'react';
import Wrapper from '../../../ui/Wrapper';
import axios from '../../../lib/axios';
import { useRouter } from 'next/navigation';
import InputError from '../../../ui/InputError';
import { useQuery } from '@tanstack/react-query';
import { ValidationErrors } from '../../../types/validation-errors';
import LoadingSpinner from '../../../ui/LoadingSpinner';

export default function CategoryCreate() {
   const router = useRouter();
   const [name, setName] = useState('');
   const [category, setCategory] = useState('');
   const [errors, setErrors] = useState<ValidationErrors>({});

   const fetchCategories = async () => {
      const response = await axios.get('/api/v1/admin/categories');

      return response.data;
   };

   const { data: categories, isPending } = useQuery({
      queryKey: ['categories'],
      queryFn: fetchCategories,
   });

   const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();

      setErrors({});

      axios
         .post('/api/v1/admin/categories', {
            name: name,
            parent_id: category,
         })
         .then((response) => {
            // TODO: show notification
            router.push('/admin/categories');
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
         <h1 className="p-2 text-3xl font-bold">Create Category</h1>
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
                  <select
                     className="select select-bordered w-full"
                     value={category}
                     onChange={(e) => setCategory(e.target.value)}
                  >
                     <option value="">Select Category</option>
                     {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                           {category.name}
                        </option>
                     ))}
                  </select>
                  <button className="btn btn-success mt-8 w-full text-white" onSubmit={handleSubmit}>
                     Submit
                  </button>
               </div>
            </form>
         </Wrapper>
      </>
   );
}

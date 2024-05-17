'use client';

import React, { useEffect, useState } from 'react';
import Wrapper from '../../../ui/Wrapper';
import axios from '../../../lib/axios';
import { useRouter } from 'next/navigation';
import InputError from '../../../ui/InputError';

export default function CategoryCreate() {
   const router = useRouter();
   const [name, setName] = useState('');
   const [categories, setCategories] = useState([]);
   const [category, setCategory] = useState('');
   const [errors, setErrors] = useState([]);

   const fetchCategories = () => {
      axios
         .get('/api/v1/admin/categories')
         .then((response) => {
            setCategories(response.data);
         })
         .catch((error) => {
            // TODO: show notification
         });
   };

   const handleSubmit = (event) => {
      event.preventDefault();

      setErrors([]);

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

   useEffect(() => {
      fetchCategories();
   }, []);

   return (
      <>
         <h1 className="text-3xl font-bold p-2">Create Category</h1>
         <Wrapper maxWidth="max-w-xl">
            <form className="flex justify-center items-center" onSubmit={handleSubmit}>
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
                  <button className="w-full btn btn-success text-white mt-8" onSubmit={handleSubmit}>
                     Submit
                  </button>
               </div>
            </form>
         </Wrapper>
      </>
   );
}

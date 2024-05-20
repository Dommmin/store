'use client';

import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../../../../ui/LoadingSpinner';
import axios from '../../../..//lib/axios';
import { useRouter } from 'next/navigation';
import Wrapper from '../../../../ui/Wrapper';
import InputError from '../../../../ui/InputError';

export default function AttributeEdit({ params }) {
   const router = useRouter();
   const [name, setName] = useState('');
   const [description, setDescription] = useState('');
   const [errors, setErrors] = useState([]);
   const [attribute, setAttribute] = useState({});
   const [isLoading, setIsLoading] = useState(true);

   const fetchAttribute = () => {
      axios
         .get('/api/v1/admin/attributes/' + params.id)
         .then((response) => {
            setAttribute(response.data);
            setName(response.data.name);
            setDescription(response.data.description);
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

   useEffect(() => {
      fetchAttribute();
   }, []);

   if (isLoading) return <LoadingSpinner className="h-screen" />;

   return (
      <>
         <h1 className="p-2 text-3xl font-bold">Edit {attribute.name}</h1>
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

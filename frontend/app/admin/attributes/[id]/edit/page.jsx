'use client';

import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../../../../ui/LoadingSpinner';
import axios from '../../../..//lib/axios';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
            console.log(error);
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
            toast.success(response.data.message, {
               autoClose: 1000,
               position: 'bottom-right',
               hideProgressBar: true,
               closeOnClick: true,
               pauseOnHover: true,
            });
            router.push('/admin/attributes/');
         })
         .catch((error) => {
            if (error.response.status === 422) {
               setErrors(error.response.data.errors);
            } else {
               toast.error(error.response.data.message, {
                  autoClose: 1000,
                  position: 'bottom-right',
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
               });
            }
         });
   };

   useEffect(() => {
      fetchAttribute();
   }, []);

   if (isLoading) return <LoadingSpinner className="h-screen" />;

   return (
      <>
         <ToastContainer />
         <h1 className="text-3xl font-bold p-2">Edit {attribute.name}</h1>
         <Wrapper maxWidth="max-w-xl">
            <form className="flex justify-center items-center" onSubmit={handleUpdate}>
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
                     className="w-full textarea textarea-bordered"
                     placeholder="Description"
                  />
                  <InputError messages={errors.description} className="mt-2" />
                  <button type="submit" className="w-full btn btn-success text-white mt-8">
                     Update
                  </button>
               </div>
            </form>
         </Wrapper>
      </>
   );
}

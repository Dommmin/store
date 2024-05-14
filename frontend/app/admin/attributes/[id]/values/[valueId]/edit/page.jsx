'use client';

import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../../../../../../ui/LoadingSpinner';
import axios from '../../../../../../lib/axios';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
            console.log(error);
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
            toast.success(response.data.message, {
               autoClose: 1000,
               position: 'bottom-right',
               hideProgressBar: true,
               closeOnClick: true,
               pauseOnHover: true,
            });
            router.push('/admin/attributes/' + params.id + '/values');
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
      fetchAttributeValue();
   }, []);

   if (isLoading) return <LoadingSpinner className="h-screen" />;

   return (
      <>
         <ToastContainer />
         <h1 className="text-3xl font-bold p-2">Edit {attributeValue.name}</h1>
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
                  <button type="submit" className="w-full btn btn-success text-white mt-8">
                     Update
                  </button>
               </div>
            </form>
         </Wrapper>
      </>
   );
}

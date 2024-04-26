import React, { useState } from 'react';
import InputError from '../../../ui/InputError.jsx';
import SuccessButton from '../../../ui/SuccessButton.jsx';
import axios from '../../../lib/axios.js';
import { Transition } from '@headlessui/react';

export default function UpdatePasswordForm({ className = '' }) {
   const initialState = {
      current_password: '',
      password: '',
      password_confirmation: '',
   };

   const [data, setData] = useState(initialState);

   const [errors, setErrors] = useState({});
   const [processing, setProcessing] = useState(false);
   const [recentlySuccessful, setRecentlySuccessful] = useState(false);

   const resetForm = () => {
      setData(initialState);
   };

   const updatePassword = (e) => {
      e.preventDefault();
      setErrors({});
      setProcessing(true);

      axios
         .put('/user/password', data)
         .then(() => {
            setRecentlySuccessful(true);
         })
         .catch((error) => {
            setErrors(error.response.data.errors);
            setProcessing(false);
         })
         .finally(() => {
            setProcessing(false);
            resetForm();
         });
   };

   return (
      <section className={className}>
         <header>
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Update Password</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
               Ensure your account is using a long, random password to stay secure.
            </p>
         </header>

         <form onSubmit={updatePassword} className="mt-6 space-y-6">
            <div>
               <label className="form-control w-full max-w-lg">
                  <div className="label">
                     <span className="label-text">Current Password</span>
                  </div>
                  <input
                     id="current_password"
                     value={data.current_password}
                     onChange={(e) => setData({ ...data, current_password: e.target.value })}
                     type="password"
                     className="input-custom max-w-lg"
                     autoComplete="current-password"
                  />
               </label>
               <InputError messages={errors.current_password} className="mt-2" />
            </div>

            <div>
               <label className="form-control w-full max-w-lg">
                  <div className="label">
                     <span className="label-text">New Password</span>
                  </div>
                  <input
                     id="password"
                     value={data.password}
                     onChange={(e) => setData({ ...data, password: e.target.value })}
                     type="password"
                     className="input-custom max-w-lg"
                     autoComplete="new-password"
                  />
               </label>
               <InputError messages={errors.password} className="mt-2" />
            </div>

            <div>
               <label className="form-control w-full max-w-lg">
                  <div className="label">
                     <span className="label-text">Confirm Password</span>
                  </div>
                  <input
                     id="password_confirmation"
                     value={data.password_confirmation}
                     onChange={(e) => setData({ ...data, password_confirmation: e.target.value })}
                     type="password"
                     className="input-custom max-w-lg"
                     autoComplete="new-password"
                  />
               </label>
               <InputError messages={errors.password_confirmation} className="mt-2" />
            </div>

            <div className="flex items-center gap-4">
               <SuccessButton disabled={processing}>Save</SuccessButton>

               <Transition
                  show={recentlySuccessful}
                  enter="transition ease-in-out"
                  enterFrom="opacity-0"
                  leave="transition ease-in-out"
                  leaveTo="opacity-0"
               >
                  <p className="text-sm text-gray-600 dark:text-gray-400">Saved.</p>
               </Transition>
            </div>
         </form>
      </section>
   );
}

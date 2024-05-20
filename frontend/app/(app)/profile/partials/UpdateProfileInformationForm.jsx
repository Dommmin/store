import React, { useState } from 'react';
import { Transition } from '@headlessui/react';
import InputError from '../../../ui/InputError.jsx';
import SuccessButton from '../../../ui/SuccessButton.jsx';
import axios from '../../../lib/axios.js';

export default function UpdateProfileInformation({ className = '', user, resendEmailVerification, refetchUser }) {
   const [data, setData] = useState({ name: user.name, email: user.email });
   const [errors, setErrors] = useState({});
   const [processing, setProcessing] = useState(false);
   const [recentlySuccessful, setRecentlySuccessful] = useState(false);
   const [status, setStatus] = useState(null);

   const submit = (e) => {
      e.preventDefault();
      setProcessing(true);

      axios
         .put('/api/v1/user/profile-information', data)
         .then(() => {
            setRecentlySuccessful(true);
            refetchUser();
         })
         .catch((error) => {
            setErrors(error.response.data.errors);
            setProcessing(false);
         })
         .finally(() => {
            setProcessing(false);
         });
   };

   return (
      <section className={className}>
         <header>
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Profile Information</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
               Update your account's profile information and email address.
            </p>
         </header>

         <form onSubmit={submit} className="mt-6 space-y-6">
            <div>
               <label className="form-control w-full max-w-lg">
                  <div className="label">
                     <span className="label-text">Name</span>
                  </div>
                  <input
                     id="name"
                     className="input input-bordered max-w-lg"
                     value={data.name}
                     onChange={(e) => setData({ ...data, name: e.target.value })}
                     autoComplete="name"
                     required
                  />
               </label>
               <InputError className="mt-2" message={errors.name} />
            </div>

            <div>
               <label className="form-control w-full max-w-lg">
                  <div className="label">
                     <span className="label-text">E-mail</span>
                  </div>
                  <input
                     id="email"
                     type="email"
                     className="input input-bordered max-w-lg"
                     value={data.email}
                     onChange={(e) => setData({ ...data, email: e.target.value })}
                     required
                     autoComplete="username"
                  />
               </label>
               <InputError className="mt-2" message={errors.email} />
            </div>

            {user.email_verified_at === null && (
               <div>
                  <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                     Your email address is unverified.
                     <button
                        type="button"
                        onClick={() => resendEmailVerification({ setStatus })}
                        className="btn btn-primary btn-sm ml-2 text-white"
                     >
                        Click here to re-send the verification email.
                     </button>
                  </p>

                  {status === 'verification-link-sent' && (
                     <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                        A new verification link has been sent to your email address.
                     </div>
                  )}
               </div>
            )}

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

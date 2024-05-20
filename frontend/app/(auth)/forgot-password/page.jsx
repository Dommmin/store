'use client';

import { useState } from 'react';
import { useAuth } from '../../hooks/auth';
import InputError from '../../ui/InputError';
import LoadingSpinner from '../../ui/LoadingSpinner';
import AuthSessionStatus from '../components/AuthSessionStatus.jsx';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
   const router = useRouter();
   const { forgotPassword, isFetching, user } = useAuth({
      middleware: 'guest',
      redirectIfAuthenticated: '/',
   });

   const [email, setEmail] = useState('');
   const [errors, setErrors] = useState([]);
   const [status, setStatus] = useState(null);

   const submitForm = (event) => {
      event.preventDefault();

      forgotPassword({ email, setErrors, setStatus });
   };

   if (isFetching) {
      return <LoadingSpinner className="h-screen" />;
   }

   if (user) {
      return router.push('/');
   }

   return (
      <div className="mx-auto flex min-h-screen max-w-lg items-center justify-center">
         <form
            onSubmit={submitForm}
            className="card glass flex w-full flex-col items-center justify-center space-y-4 bg-white py-12 shadow-xl dark:bg-gray-800"
         >
            <h1 className="text-3xl font-bold text-gray-200">Forgot your password? </h1>
            <div className="px-8 text-center text-sm text-gray-300">
               No problem. Just let us know your email address and we will email you a password reset link that will
               allow you to choose a new one.
            </div>

            {/* Session Status */}
            <AuthSessionStatus className="mb-4" status={status} />

            <label className="input input-bordered flex w-full max-w-md items-center gap-2">
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
               >
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
               </svg>
               <input
                  name="email"
                  id="email"
                  type="text"
                  className="grow"
                  placeholder="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
               />
            </label>
            <InputError messages={errors.email} className="mt-2" />

            <button type="submit" className="btn btn-info w-full max-w-md tracking-wide text-white">
               Reset Password
            </button>
         </form>
      </div>
   );
}

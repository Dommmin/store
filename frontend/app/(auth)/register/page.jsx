'use client';

import { useAuth } from '../../hooks/auth';
import InputError from '../../ui/InputError.jsx';
import LoadingSpinner from '../../ui/LoadingSpinner.jsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Register() {
   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [passwordConfirmation, setPasswordConfirmation] = useState('');
   const [errors, setErrors] = useState([]);
   const router = useRouter();

   const { register, isLoading, isFetching, user } = useAuth({
      middleware: 'guest',
      redirectIfAuthenticated: '/',
   });

   const submitForm = async (event) => {
      event.preventDefault();

      await register({
         name,
         email,
         password,
         password_confirmation: passwordConfirmation,
         setErrors,
      });
   };

   if (isFetching) {
      return <LoadingSpinner className="h-screen" />;
   }

   if (user) {
      return router.push('/');
   }

   return (
      <div className="mx-auto flex min-h-screen max-w-lg items-center justify-center">
         <div className="card glass flex w-full flex-col items-center justify-center space-y-4 bg-white py-6 shadow-xl dark:bg-gray-800">
            <form className="w-full max-w-md" onSubmit={submitForm}>
               <h1 className="text-center text-3xl font-bold text-black dark:text-gray-200">Register new account</h1>
               <div className="space-y-4 py-6">
                  <div>
                     <label className="input input-bordered flex items-center gap-2">
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           viewBox="0 0 16 16"
                           fill="currentColor"
                           className="h-4 w-4 opacity-70"
                        >
                           <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                        </svg>
                        <input
                           className="grow"
                           type="text"
                           name="name"
                           id="name"
                           value={name}
                           onChange={(event) => setName(event.target.value)}
                           placeholder="Username"
                           autoComplete="off"
                           required
                        />
                     </label>
                     <InputError messages={errors.name} className="mt-2" />
                  </div>

                  <div>
                     <div>
                        <label className="input input-bordered flex items-center gap-2">
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
                              autoComplete="off"
                              required
                           />
                        </label>
                        <InputError messages={errors.email} className="mt-2" />
                     </div>
                  </div>

                  <div>
                     <label className="input input-bordered flex items-center gap-2">
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           viewBox="0 0 16 16"
                           fill="currentColor"
                           className="h-4 w-4 opacity-70"
                        >
                           <path
                              fillRule="evenodd"
                              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                              clipRule="evenodd"
                           />
                        </svg>
                        <input
                           className="grow"
                           type="password"
                           name="password"
                           id="password"
                           placeholder="Password"
                           value={password}
                           onChange={(event) => setPassword(event.target.value)}
                           autoComplete="new-password"
                           required
                        />
                     </label>
                     <InputError messages={errors.password} className="mt-2" />
                  </div>

                  <div>
                     <label className="input input-bordered flex items-center gap-2">
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           viewBox="0 0 16 16"
                           fill="currentColor"
                           className="h-4 w-4 opacity-70"
                        >
                           <path
                              fillRule="evenodd"
                              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                              clipRule="evenodd"
                           />
                        </svg>
                        <input
                           type="password"
                           name="passwordConfirmation"
                           id="passwordConfirmation"
                           placeholder="Confirm Password"
                           className="grow"
                           autoComplete="new-password"
                           value={passwordConfirmation}
                           onChange={(event) => setPasswordConfirmation(event.target.value)}
                        />
                     </label>
                     <InputError messages={errors.password_confirmation} className="mt-2" />
                  </div>
               </div>

               <button
                  className="btn btn-info w-full max-w-md font-bold uppercase tracking-widest text-white"
                  type="submit"
                  disabled={isLoading}
               >
                  {isLoading ? <span className="loading loading-spinner" /> : 'sign up'}
               </button>

               <div className="space-x-1 pt-2 text-center">
                  <span className="text-gray-600 dark:text-gray-200">Already have an account? </span>
                  <Link className="link-hover link font-bold tracking-wide text-success" href="/login">
                     Login
                  </Link>
               </div>
            </form>
         </div>
      </div>
   );
}

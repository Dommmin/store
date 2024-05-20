'use client';

import InputError from '../../../ui/InputError';
import { useAuth } from '../../../hooks/auth';
import { useEffect, useState } from 'react';
import AuthSessionStatus from '../../components/AuthSessionStatus';
import { useSearchParams } from 'next/navigation';

export default function PasswordReset() {
   const [searchParams] = useSearchParams();

   const { resetPassword } = useAuth({ middleware: 'guest' });

   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [passwordConfirmation, setPasswordConfirmation] = useState('');
   const [errors, setErrors] = useState([]);
   const [status, setStatus] = useState(null);

   const submitForm = (event) => {
      event.preventDefault();

      resetPassword({
         email,
         password,
         password_confirmation: passwordConfirmation,
         setErrors,
         setStatus,
      });
   };

   useEffect(() => {
      setEmail(searchParams.get('email'));
   }, [searchParams.get('email')]);

   return (
      <div className="mx-auto flex min-h-screen max-w-lg items-center justify-center">
         <AuthSessionStatus className="mb-4" status={status} />
         <form
            onSubmit={submitForm}
            className="card glass flex w-full flex-col items-center justify-center space-y-4 bg-white py-12 shadow-xl dark:bg-gray-800"
         >
            <h1 className="text-3xl font-bold text-gray-200">Reset your password</h1>
            <label className="form-control w-full max-w-md">
               <div className="label">
                  <span className="label-text text-gray-200">E-mail</span>
               </div>
               <input
                  className="input input-bordered input-primary w-full max-w-md"
                  type="email"
                  id="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
               />
               <InputError messages={errors.email} className="mt-2" />
            </label>

            <label className="form-control w-full max-w-md">
               <div className="label">
                  <span className="label-text text-gray-200">Password</span>
               </div>
               <input
                  className="input input-bordered input-primary w-full max-w-md"
                  id="password"
                  type="password"
                  onChange={(event) => setPassword(event.target.value)}
                  value={password}
                  autoComplete="new-password"
               />
               <InputError messages={errors.password} className="mt-2" />
            </label>

            <label className="form-control w-full max-w-md">
               <div className="label">
                  <span className="label-text text-gray-200">Confirm password</span>
               </div>
               <input
                  className="input input-bordered input-primary w-full max-w-md"
                  id="passwordConfirmation"
                  type="password"
                  value={passwordConfirmation}
                  onChange={(event) => setPasswordConfirmation(event.target.value)}
                  required
                  autoComplete="new-password"
               />
               <InputError messages={errors.password_confirmation} className="mt-2" />
            </label>

            <div className="mt-4 flex w-full max-w-md items-center justify-end">
               <button type="submit" className="btn btn-primary w-full max-w-md tracking-wide dark:text-gray-200">
                  Reset Password
               </button>
            </div>
         </form>
      </div>
   );
}

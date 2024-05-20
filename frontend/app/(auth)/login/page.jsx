'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from '../../lib/axios.js';
import InputError from '../../ui/InputError.jsx';
import LoadingSpinner from '../../ui/LoadingSpinner.jsx';
import { useAuth } from '../../hooks/auth.js';
import AuthSessionStatus from '../components/AuthSessionStatus.jsx';
import GoogleAuth from '../components/GoogleAuth';
import FacebookAuth from '../components/FacebookAuth';
import GithubAuth from '../components/GithubAuth';
import { useRouter } from 'next/navigation';

export default function Login() {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [shouldRemember, setShouldRemember] = useState(false);
   const [errors, setErrors] = useState([]);
   const [status, setStatus] = useState(null);
   const router = useRouter();

   const { login, isLoading, isFetching, user } = useAuth({
      middleware: 'guest',
      redirectIfAuthenticated: '/',
   });

   useEffect(() => {
      if (router.reset?.length > 0 && errors.length === 0) {
         setStatus(atob(router.reset));
      } else {
         setStatus(null);
      }
   }, [router.reset, errors]);

   const submitForm = async (event) => {
      event.preventDefault();

      await login({
         email,
         password,
         remember: shouldRemember,
         setErrors,
         setStatus,
      });
   };

   const handleLoginAsAdmin = async (event) => {
      event.preventDefault();

      await login({
         email: 'admin@example.com',
         password: 'password',
         remember: shouldRemember,
         setErrors,
         setStatus,
      });
   };

   const handleLoginAsUser = async (event) => {
      event.preventDefault();

      await login({
         email: 'user@example.com',
         password: 'password',
         remember: shouldRemember,
         setErrors,
         setStatus,
      });
   };

   const handleGoogleLogin = async (event) => {
      event.preventDefault();

      const response = await axios.get('/api/v1/auth/google/url');

      if (response) {
         window.location.href = response.data.url;
      }
   };

   const handleFacebookLogin = async (event) => {
      event.preventDefault();

      const response = await axios.get('/api/v1/auth/facebook/url');

      if (response) {
         window.location.href = response.data.url;
      }
   };

   const handleGithubLogin = async (event) => {
      event.preventDefault();

      const response = await axios.get('/api/v1/auth/github/url');

      if (response) {
         window.location.href = response.data.url;
      }
   };

   if (isFetching) {
      return <LoadingSpinner className="h-screen" />;
   }

   if (user) {
      return router.push('/');
   }

   return (
      <div className="mx-auto flex min-h-screen max-w-lg items-center justify-center">
         <AuthSessionStatus className="mb-4" status={status} />
         <div className="card glass flex w-full flex-col items-center justify-center space-y-4 bg-white py-4 shadow-xl dark:bg-gray-800">
            <form className="w-full max-w-md" onSubmit={submitForm}>
               <h1 className="text-center text-3xl font-bold text-black dark:text-gray-200">Login to your account</h1>
               <div className="mb-2 mt-4 space-y-4">
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
                           required
                        />
                     </label>
                     <InputError messages={errors.email} className="mt-2" />
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
                           name="password"
                           id="password"
                           placeholder="Password"
                           className="grow"
                           value={password}
                           onChange={(event) => setPassword(event.target.value)}
                           autoComplete="old-password"
                        />
                     </label>
                     <InputError messages={errors.password} className="mt-2" />
                  </div>
               </div>
               <div className="mb-2 flex w-full max-w-md items-center justify-between">
                  <label className="label cursor-pointer">
                     <input
                        checked={shouldRemember}
                        onChange={(event) => setShouldRemember(event.target.checked)}
                        type="checkbox"
                        className="checkbox-info checkbox mr-2"
                     />
                     <span className="text-gray-600 dark:text-gray-200">Remember me</span>
                  </label>
                  <Link className="link-hover link font-bold tracking-wide text-primary" href="/forgot-password">
                     Forgot password?
                  </Link>
               </div>

               <button
                  className="btn btn-info w-full max-w-md font-bold uppercase tracking-widest text-white"
                  type="submit"
                  disabled={isLoading}
               >
                  {isLoading ? <span className="loading loading-spinner" /> : 'sign in'}
               </button>
               <div className="flex w-full max-w-md items-center justify-between pt-2">
                  <button onClick={handleLoginAsUser} className="btn btn-primary btn-sm text-white">
                     Login as User
                  </button>
                  <button disabled onClick={handleLoginAsAdmin} className="btn btn-primary btn-sm text-white">
                     Login as Admin
                  </button>
               </div>
            </form>

            {/*Google*/}
            <GoogleAuth onClick={handleGoogleLogin} />

            {/*Facebook*/}
            <FacebookAuth onClick={handleFacebookLogin} />

            {/*Github*/}
            <GithubAuth onClick={handleGithubLogin} />

            <div className="space-x-1 text-center">
               <span className="text-gray-600 dark:text-gray-200">{"Don't have an account? "}</span>
               <Link className="link-hover link font-bold tracking-wide text-error" href="/register">
                  Register
               </Link>
            </div>
         </div>
      </div>
   );
}

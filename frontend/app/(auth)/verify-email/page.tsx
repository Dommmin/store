'use client';

import { useAuth } from '../../hooks/auth';
import { useState } from 'react';

export default function VerifyEmail() {
   const { logout, resendEmailVerification } = useAuth({
      middleware: 'auth',
      redirectIfAuthenticated: '/',
   });

   const [status, setStatus] = useState(null);

   return (
      <div className="mx-auto flex min-h-screen max-w-lg items-center justify-center">
         <div className="card glass w-full items-center justify-center space-y-4 bg-white py-12 shadow-xl dark:bg-gray-800">
            <h1 className="text-3xl font-bold text-gray-200">Thanks for signing up!</h1>
            <div className="px-8 text-center text-sm text-gray-300">
               Before getting started, could you verify your email address by clicking on the link we just emailed to
               you? If you didn't receive the email, we will gladly send you another.
               {status === 'verification-link-sent' && (
                  <div className="mb-4 mt-4 text-sm font-medium text-green-600">
                     A new verification link has been sent to the email address you provided during registration.
                  </div>
               )}
            </div>
            <div className="mt-4 flex items-center justify-between space-x-2">
               <button
                  type="button"
                  className="btn btn-primary max-w-md tracking-wide dark:text-gray-200"
                  onClick={() => resendEmailVerification({ setStatus })}
               >
                  Resend Verification Email
               </button>

               <button
                  type="button"
                  className="btn-default btn max-w-md tracking-wide dark:text-gray-200"
                  onClick={logout}
               >
                  Logout
               </button>
            </div>
         </div>
      </div>
   );
}

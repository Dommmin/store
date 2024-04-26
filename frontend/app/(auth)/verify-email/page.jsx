import { useAuth } from '../../hooks/auth';
import { useState } from 'react';

export default function VerifyEmail() {
   const { logout, resendEmailVerification } = useAuth({
      middleware: 'auth',
      redirectIfAuthenticated: '/',
   });

   const [status, setStatus] = useState(null);

   return (
      <div className="flex items-center justify-center min-h-screen max-w-lg mx-auto">
         <div className="items-center justify-center w-full space-y-4 card bg-white glass dark:bg-gray-800 shadow-xl py-12">
            <h1 className="font-bold text-3xl text-gray-200">Thanks for signing up!</h1>
            <div className="text-center px-8 text-sm text-gray-300">
               Before getting started, could you verify your email address by clicking on the link we just emailed to
               you? If you didn't receive the email, we will gladly send you another.
               {status === 'verification-link-sent' && (
                  <div className="mb-4 mt-4 font-medium text-sm text-green-600">
                     A new verification link has been sent to the email address you provided during registration.
                  </div>
               )}
            </div>
            <div className="mt-4 flex items-center justify-between space-x-2">
               <button
                  type="button"
                  className="btn btn-primary max-w-md dark:text-gray-200 tracking-wide"
                  onClick={() => resendEmailVerification({ setStatus })}
               >
                  Resend Verification Email
               </button>

               <button
                  type="button"
                  className="btn btn-default max-w-md dark:text-gray-200 tracking-wide"
                  onClick={logout}
               >
                  Logout
               </button>
            </div>
         </div>
      </div>
   );
}

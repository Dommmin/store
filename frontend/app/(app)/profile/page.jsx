'use client';

import { useEffect } from 'react';
import DeleteUserForm from './partials/DeleteUserForm.jsx';
import UpdatePasswordForm from './partials/UpdatePasswordForm.jsx';
import UpdateProfileInformationForm from './partials/UpdateProfileInformationForm.jsx';
import TwoFactorAuthenticationForm from './partials/TwoFactorAuthenticationForm.jsx';
import { useAuth } from '../../hooks/auth.js';
import { useTwoFactor } from '../../hooks/two-factor.js';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { useRouter } from 'next/navigation';

export default function Edit() {
   const { disableTwoFactorAuthentication } = useTwoFactor();
   const router = useRouter();
   const { user, resendEmailVerification, isFetching, refetch } = useAuth({ middleware: 'auth' });

   useEffect(() => {
      if (user) {
         if (!user.two_factor_confirmed_at && user.two_factor_enabled) {
            disableTwoFactorAuthentication();
         }
      }
   }, []);

   if (isFetching) {
      return <LoadingSpinner className="h-screen" />;
   }

   if (!user) {
      return router.push('/login');
   }

   return (
      <div className="py-12">
         <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
            <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
               <UpdateProfileInformationForm
                  className="max-w-xl"
                  user={user}
                  refetchUser={refetch}
                  resendEmailVerification={resendEmailVerification}
               />
            </div>

            <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
               <UpdatePasswordForm className="max-w-xl" />
            </div>

            <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
               <TwoFactorAuthenticationForm className="max-w-xl" user={user} refetchUser={refetch} />
            </div>

            <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
               <DeleteUserForm className="max-w-xl" />
            </div>
         </div>
      </div>
   );
}

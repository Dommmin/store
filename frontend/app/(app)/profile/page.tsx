'use client';

import DeleteUserForm from './partials/DeleteUserForm';
import UpdatePasswordForm from './partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './partials/UpdateProfileInformationForm';
import TwoFactorAuthenticationForm from './partials/TwoFactorAuthenticationForm';
import useAuth from '../../hooks/auth';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { useRouter } from 'next/navigation';

export default function Edit() {
   const router = useRouter();
   const { user, resendEmailVerification, isPending, refetch } = useAuth({ middleware: 'auth' });

   if (isPending) {
      return <LoadingSpinner className="h-screen" />;
   }

   if (!user) {
      router.push('/login');
      return null;
   }

   return (
      <div className="py-12">
         <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
            <div className="bg-white p-4 shadow dark:bg-gray-800 sm:rounded-lg sm:p-8">
               <UpdateProfileInformationForm
                  className="max-w-xl"
                  user={user}
                  refetchUser={refetch}
                  resendEmailVerification={resendEmailVerification}
               />
            </div>

            <div className="bg-white p-4 shadow dark:bg-gray-800 sm:rounded-lg sm:p-8">
               <UpdatePasswordForm className="max-w-xl" />
            </div>

            <div className="bg-white p-4 shadow dark:bg-gray-800 sm:rounded-lg sm:p-8">
               <TwoFactorAuthenticationForm className="max-w-xl" user={user} />
            </div>

            <div className="bg-white p-4 shadow dark:bg-gray-800 sm:rounded-lg sm:p-8">
               <DeleteUserForm className="max-w-xl" />
            </div>
         </div>
      </div>
   );
}

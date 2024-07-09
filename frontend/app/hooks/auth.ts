import { useEffect, useState } from 'react';
import axios from '../lib/axios';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

interface User {
   id: number;
   name: string;
   email: string;
   email_verified_at?: string;
   two_factor_enabled: boolean;
   two_factor_confirmed_at?: string;
   two_factor_recovery_codes?: string;
   profile_photo_url: string;
}

interface AuthHook {
   user: User | null;
   isLoading: boolean;
   isPending: boolean;
   refetch: () => void;
   register: (params: { setErrors: Function } & Record<string, any>) => Promise<void>;
   login: (params: { setErrors: Function; setStatus: Function } & Record<string, any>) => Promise<void>;
   forgotPassword: (params: {
      setErrors: Function;
      setStatus: Function;
      setMessage: Function;
      email: string;
   }) => Promise<void>;
   resetPassword: (params: { setErrors: Function; setStatus: Function } & Record<string, any>) => Promise<void>;
   resendEmailVerification: (params: { setStatus: Function }) => void;
   logout: () => Promise<void>;
   getCsrfToken: () => Promise<void>;
}

interface AuthOptions {
   middleware?: string;
   redirectIfAuthenticated?: string;
}

export const useAuth = ({ middleware = 'guest', redirectIfAuthenticated }: AuthOptions = {}): AuthHook => {
   const [isLoading, setIsLoading] = useState(false);
   const router = useRouter();
   const params = useParams<{ token: string }>();

   const fetchUser = async () => {
      const response = await axios.get('/api/v1/user');
      return response.data;
   };

   const {
      data: user,
      refetch,
      isPending,
      isError,
      error,
   } = useQuery<User | null>({
      queryKey: ['user'],
      queryFn: fetchUser,
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 1000,
   });

   const getCsrfToken = async () => {
      await axios.get('/api/v1/sanctum/csrf-cookie');
   };

   const register = async ({ setErrors, ...props }: { setErrors: Function } & Record<string, any>): Promise<void> => {
      setIsLoading(true);
      await getCsrfToken();

      setErrors({});

      try {
         const response = await axios.post('/api/v1/register', props);
         if (response.status === 200) {
            router.push('/');
            return null;
         }
      } catch (error) {
         if (error.response?.status !== 422) throw error;

         setErrors(error.response.data.errors);
      } finally {
         setIsLoading(false);
      }
   };

   const login = async ({
      setErrors,
      setStatus,
      ...props
   }: {
      setErrors: Function;
      setStatus: Function;
   } & Record<string, any>) => {
      setIsLoading(true);
      await getCsrfToken();

      setErrors({});
      setStatus(null);

      try {
         const response = await axios.post('/api/v1/login', props);
         if (response.data?.two_factor) {
            router.push('/two-factor-challenge');
            return null;
         }
         if (response.status === 200) {
            router.push('/');
            return null;
         }
      } catch (error) {
         if (error.response?.status !== 422) throw error;

         setErrors(error.response.data.errors);
      } finally {
         setIsLoading(false);
      }
   };

   const forgotPassword = async ({
      setErrors,
      setStatus,
      setMessage,
      email,
   }: {
      setErrors: Function;
      setStatus: Function;
      setMessage: Function;
      email: string;
   }) => {
      await getCsrfToken();

      setErrors({});
      setMessage('');
      setStatus(null);

      try {
         const response = await axios.post('/api/v1/forgot-password', { email });
         setStatus(response.data.status);
         setMessage(response.data.message);
      } catch (error) {
         if (error.response?.status !== 422) throw error;

         setErrors(error.response.data.errors);
      }
   };

   const resetPassword = async ({
      setErrors,
      setStatus,
      ...props
   }: {
      setErrors: Function;
      setStatus: Function;
   } & Record<string, any>) => {
      await getCsrfToken();

      setErrors({});
      setStatus(null);

      try {
         const response = await axios.post('/api/v1/reset-password', {
            token: params.token,
            ...props,
         });
         router.push('/login?reset=' + btoa(response.data.status));
      } catch (error) {
         if (error.response?.status !== 422) throw error;

         setErrors(error.response.data.errors);
      }
   };

   const resendEmailVerification = ({ setStatus }: { setStatus: Function }) => {
      axios.post('/api/v1/email/verification-notification').then((response) => setStatus(response.data.status));
   };

   const logout = async () => {
      if (!error) {
         await axios.post('/api/v1/logout').then(() => refetch());
      }

      window.location.pathname = '/';
   };

   useEffect(() => {
      if (middleware === 'guest' && redirectIfAuthenticated && user) router.push(redirectIfAuthenticated);
      if (window.location.pathname === '/verify-email' && user?.email_verified_at) router.push(redirectIfAuthenticated);
      if (middleware === 'auth' && error) logout();
   }, [user, error]);

   return {
      user,
      isLoading,
      isPending,
      refetch,
      register,
      login,
      forgotPassword,
      resetPassword,
      resendEmailVerification,
      logout,
      getCsrfToken,
   };
};

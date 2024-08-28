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
   is_admin: boolean;
}

interface ValidationErrors {
   [key: string]: string[];
}

interface AuthHook {
   user: User | null;
   isLoading: boolean;
   isPending: boolean;
   refetch: () => void;
   register: (params: { setErrors: (errors: ValidationErrors) => void } & Record<string, unknown>) => Promise<void>;
   login: (
      params: {
         setErrors: (errors: ValidationErrors) => void;
         setStatus: (status: number | null) => void;
      } & Record<string, unknown>,
   ) => Promise<void>;
   forgotPassword: (params: {
      setErrors: (errors: ValidationErrors) => void;
      setStatus: (status: number | null) => void;
      setMessage: (message: string) => void;
      email: string;
   }) => Promise<void>;
   resetPassword: (
      params: {
         setErrors: (errors: ValidationErrors) => void;
         setStatus: (status: number | null) => void;
      } & Record<string, unknown>,
   ) => Promise<void>;
   resendEmailVerification: (params: { setStatus: (status: string) => void }) => void;
   logout: () => Promise<void>;
   getCsrfToken: () => Promise<void>;
}

interface AuthOptions {
   middleware?: string;
   redirectIfAuthenticated?: string;
}

const useAuth = ({ middleware = 'guest', redirectIfAuthenticated }: AuthOptions = {}): AuthHook => {
   const [isLoading, setIsLoading] = useState(false);
   const router = useRouter(); // Używamy useRouter z next/navigation
   const params = useParams();

   const fetchUser = async (): Promise<User | null> => {
      const response = await axios.get('/api/v1/user');

      return response.data as User;
   };

   const {
      data: user,
      refetch,
      isPending,
      isError,
   } = useQuery<User | null>({
      queryKey: ['user'],
      queryFn: fetchUser,
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 1000,
   });

   const getCsrfToken = async (): Promise<void> => {
      await axios.get('/api/v1/sanctum/csrf-cookie');
   };

   const register = async ({
      setErrors,
      ...props
   }: {
      setErrors: (errors: ValidationErrors) => void;
   } & Record<string, unknown>): Promise<void> => {
      setIsLoading(true);
      await getCsrfToken();

      setErrors({});

      try {
         const response = await axios.post('/api/v1/register', props);
         if (response.status === 200) {
            router.push('/');
         }
      } catch (error) {
         if (error.response?.status === 401 && middleware === 'auth') {
            router.push('/login'); // Przekierowanie do strony logowania tylko w trybie 'auth'
         }
         throw error;
      } finally {
         setIsLoading(false);
      }
   };

   const login = async ({
      setErrors,
      setStatus,
      ...props
   }: {
      setErrors: (errors: ValidationErrors) => void;
      setStatus: (status: number | null) => void;
   } & Record<string, unknown>): Promise<void> => {
      setIsLoading(true);
      await getCsrfToken();

      setErrors({});
      setStatus(null);

      try {
         const response = await axios.post('/api/v1/login', props);
         if (response.data?.two_factor) {
            router.push('/two-factor-challenge');
         } else if (response.status === 200) {
            refetch();
            router.push('/');
         }
      } catch (error) {
         if (error.response?.status === 401 && middleware === 'auth') {
            router.push('/login'); // Przekierowanie do strony logowania tylko w trybie 'auth'
         }
         throw error;
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
      setErrors: (errors: ValidationErrors) => void;
      setStatus: (status: number | null) => void;
      setMessage: (message: string) => void;
      email: string;
   }): Promise<void> => {
      await getCsrfToken();

      setErrors({});
      setMessage('');
      setStatus(null);

      try {
         const response = await axios.post('/api/v1/forgot-password', { email });
         setStatus(response.data.status);
         setMessage(response.data.message);
      } catch (error) {
         if (error.response?.status === 401 && middleware === 'auth') {
            router.push('/login'); // Przekierowanie do strony logowania tylko w trybie 'auth'
         }
         throw error;
      }
   };

   const resetPassword = async ({
      setErrors,
      setStatus,
      ...props
   }: {
      setErrors: (errors: ValidationErrors) => void;
      setStatus: (status: number | null) => void;
   } & Record<string, unknown>): Promise<void> => {
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
         if (error.response?.status === 401 && middleware === 'auth') {
            router.push('/login'); // Przekierowanie do strony logowania tylko w trybie 'auth'
         }
         throw error;
      }
   };

   const resendEmailVerification = ({ setStatus }: { setStatus: (status: string) => void }): void => {
      axios.post('/api/v1/email/verification-notification').then((response) => setStatus(response.data.status));
   };

   const logout = async (): Promise<void> => {
      try {
         await axios.post('/api/v1/logout');
          await refetch();
          window.location.reload();
      } catch (error) {
         console.error('Błąd podczas wylogowywania:', error);
      }
   };

   useEffect(() => {
      if (isError && middleware === 'auth') {
         router.push('/login');
      }
   }, [isError]);

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

export default useAuth;

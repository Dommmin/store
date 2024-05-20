import { useEffect, useState } from 'react';
import axios from '../lib/axios.js';
import { useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
   const [isLoading, setIsLoading] = useState(false);
   const router = useRouter();
   const params = useParams();

   const {
      data: user,
      error,
      mutate: refetch,
      isLoading: isFetching,
      isValidating,
   } = useSWR(
      '/api/v1/user',
      () =>
         axios
            .get('/api/v1/user')
            .then((res) => res.data)
            .catch((error) => {
               if (error.response.status !== 409) throw error;

               router.push('/verify-email');
            }),
      { focusThrottleInterval: 15000 },
   );

   const getCsrfToken = () => axios.get('/api/v1/sanctum/csrf-cookie');

   const register = async ({ setErrors, ...props }) => {
      setIsLoading(true);
      await getCsrfToken();

      setErrors([]);

      axios
         .post('/api/v1/register', props)
         .then(() => refetch())
         .catch((error) => {
            if (error.response.status !== 422) throw error;

            setErrors(error.response.data.errors);
         })
         .finally(() => setIsLoading(false));
   };

   const login = async ({ setErrors, setStatus, ...props }) => {
      setIsLoading(true);
      await getCsrfToken();

      setErrors([]);
      setStatus(null);

      axios
         .post('/api/v1/login', props)
         .then((response) => {
            if (response.data?.two_factor) {
               return router.push('/two-factor-challenge');
            }
            refetch();
         })
         .catch((error) => {
            if (error.response.status !== 422) throw error;

            setErrors(error.response.data.errors);
         })
         .finally(() => setIsLoading(false));
   };

   const forgotPassword = async ({ setErrors, setStatus, email }) => {
      await getCsrfToken();

      setErrors([]);
      setStatus(null);

      axios
         .post('/api/v1/forgot-password', { email })
         .then((response) => setStatus(response.data.status))
         .catch((error) => {
            if (error.response.status !== 422) throw error;

            setErrors(error.response.data.errors);
         });
   };

   const resetPassword = async ({ setErrors, setStatus, ...props }) => {
      await getCsrfToken();

      setErrors([]);
      setStatus(null);

      axios
         .post('/api/v1/reset-password', { token: params.token, ...props })
         .then((response) => router.push('/login?reset=' + btoa(response.data.status)))
         .catch((error) => {
            if (error.response.status !== 422) throw error;

            setErrors(error.response.data.errors);
         });
   };

   const resendEmailVerification = ({ setStatus }) => {
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
      register,
      login,
      forgotPassword,
      resetPassword,
      resendEmailVerification,
      logout,
      isLoading,
      isFetching,
      isValidating,
      refetch,
      getCsrfToken,
   };
};

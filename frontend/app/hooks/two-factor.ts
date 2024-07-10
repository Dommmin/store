import axios from '../lib/axios';
import { useState } from 'react';
import useAuth from './auth';
import { ValidationErrors } from '../types/validation-errors';

export const useTwoFactor = () => {
   const [enabling, setEnabling] = useState(false);
   const [confirming, setConfirming] = useState(false);
   const [postConfirming, setPostConfirming] = useState(false);
   const [disabling, setDisabling] = useState(false);
   const [qrCode, setQrCode] = useState(null);
   const [setupKey, setSetupKey] = useState(null);
   const [recoveryCodes, setRecoveryCodes] = useState([]);
   const [confirmationCode, setConfirmationCode] = useState('');
   const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
   const [errors, setErrors] = useState<ValidationErrors>({});
   const [isLoading, setIsLoading] = useState(true);

   const { refetch: refetchUser } = useAuth();

   const showQrCode = async () => {
      const response = await axios.get('/api/v1/user/two-factor-qr-code');
      setQrCode(response.data.svg);
   };

   const showSetupKey = async () => {
      const response = await axios.get('/api/v1/user/two-factor-secret-key');
      setSetupKey(response.data.secretKey);
   };

   const showRecoveryCodes = async () => {
      const response = await axios.get('/api/v1/user/two-factor-recovery-codes');
      setRecoveryCodes(response.data);
   };

   const confirmTwoFactorAuthentication = async () => {
      setPostConfirming(true);
      setErrors({});

      try {
         const response = await axios.post('/api/v1/user/confirmed-two-factor-authentication', {
            code: confirmationCode,
         });

         if (response.status === 200) {
            setQrCode(null);
            setSetupKey(null);
            setConfirmationCode('');
            setConfirming(false);
         }
      } catch (error) {
         setErrors(error.response.data.errors);
      } finally {
         setPostConfirming(false);
         refetchUser();
      }
   };

   const regenerateRecoveryCodes = async () => {
      try {
         const response = await axios.post('/api/v1/user/two-factor-recovery-codes');

         if (response.status === 200) {
            await showRecoveryCodes();
         }
      } catch (error) {
         setErrors(error.response.data.errors);
      }
   };

   const enableTwoFactorAuthentication = async () => {
      setEnabling(true);

      try {
         const response = await axios.post('/api/v1/user/two-factor-authentication');

         if (response.status === 200) {
            await showQrCode();
            await showSetupKey();
            await showRecoveryCodes();
         }
      } catch (error) {
         setErrors(error.response.data.errors);
      } finally {
         setConfirming(true);
         setEnabling(false);
         setTwoFactorEnabled(true);
      }
   };

   const disableTwoFactorAuthentication = async () => {
      setDisabling(true);
      setPostConfirming(true);
      setErrors({});

      try {
         const response = await axios.delete('/api/v1/user/two-factor-authentication');

         if (response.status === 200) {
            setQrCode(null);
            setSetupKey(null);
         }
      } catch (error) {
         setErrors(error.response.data.errors);
      } finally {
         setPostConfirming(false);
         setDisabling(false);
         setConfirmationCode('');
         setTwoFactorEnabled(false);
         setConfirming(false);
         refetchUser();
      }
   };

   return {
      enabling,
      confirming,
      postConfirming,
      disabling,
      errors,
      isLoading,
      setIsLoading,
      twoFactorEnabled,
      qrCode,
      setupKey,
      confirmationCode,
      setTwoFactorEnabled,
      setConfirmationCode,
      recoveryCodes,
      showRecoveryCodes,
      regenerateRecoveryCodes,
      confirmTwoFactorAuthentication,
      disableTwoFactorAuthentication,
      enableTwoFactorAuthentication,
      showQrCode,
   };
};

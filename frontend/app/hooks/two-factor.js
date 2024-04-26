import axios from '../lib/axios.js';
import { useState } from 'react';
import { useAuth } from './auth.js';

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
   const [requiresConfirmation, setRequiresConfirmation] = useState(false);
   const [errors, setErrors] = useState({});
   const [isLoading, setIsLoading] = useState(true);

   const { refetch: refetchUser } = useAuth();

   const showQrCode = () => {
      return axios.get('/user/two-factor-qr-code').then((response) => {
         setQrCode(response.data.svg);
      });
   };

   const showSetupKey = () => {
      return axios.get('/user/two-factor-secret-key').then((response) => {
         setSetupKey(response.data.secretKey);
      });
   };

   const showRecoveryCodes = () => {
      return axios.get('/user/two-factor-recovery-codes').then((response) => {
         setRecoveryCodes(response.data);
      });
   };

   const confirmTwoFactorAuthentication = () => {
      setPostConfirming(true);
      setErrors({});

      axios
         .post('/user/confirmed-two-factor-authentication', { code: confirmationCode })
         .then(() => {
            setQrCode(null);
            setSetupKey(null);
         })
         .catch((error) => {
            setErrors(error.response.data.errors);
         })
         .finally(() => {
            setPostConfirming(false);
            setConfirming(false);
            setConfirmationCode('');
            refetchUser();
         });
   };

   const regenerateRecoveryCodes = () => {
      axios.post('/user/two-factor-recovery-codes').then(() => showRecoveryCodes());
   };
   const enableTwoFactorAuthentication = () => {
      setEnabling(true);

      axios
         .post('/user/two-factor-authentication')
         .then(async () => {
            await showQrCode();
            await showSetupKey();
            await showRecoveryCodes();
            await refetchUser();
         })
         .finally(() => {
            setConfirming(requiresConfirmation);
            setEnabling(false);
         });
   };

   const disableTwoFactorAuthentication = () => {
      setDisabling(true);
      setPostConfirming(true);
      setErrors({});

      axios
         .delete('/user/two-factor-authentication')
         .then(async () => {
            await refetchUser();
            await setDisabling(false);
            await setIsLoading(false);
         })
         .finally(() => {
            setConfirming(false);
            setPostConfirming(false);
         });
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
      setRequiresConfirmation,
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

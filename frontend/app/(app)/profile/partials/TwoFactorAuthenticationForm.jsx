import { useEffect } from 'react';
import axios from '../../../lib/axios.js';
import InputError from '../../../ui/InputError.jsx';
import DangerButton from '../../../ui/DangerButton.jsx';
import SecondaryButton from '../../../ui/SecondaryButton.jsx';
import PrimaryButton from '../../../ui/PrimaryButton.jsx';
import SuccessButton from '../../../ui/SuccessButton.jsx';
import ConfirmPassword from '../../../(auth)/components/ConfirmPassword.jsx';
import { useTwoFactor } from '../../../hooks/two-factor.js';

export default function TwoFactorAuthenticationForm({ className = '', user }) {
   const {
      enabling,
      confirming,
      postConfirming,
      twoFactorEnabled,
      setTwoFactorEnabled,
      setRequiresConfirmation,
      setConfirmationCode,
      qrCode,
      setupKey,
      regenerateRecoveryCodes,
      showRecoveryCodes,
      recoveryCodes,
      disabling,
      confirmTwoFactorAuthentication,
      disableTwoFactorAuthentication,
      enableTwoFactorAuthentication,
      errors,
      confirmationCode,
   } = useTwoFactor();

   const twoFactorAuthenticationEnabled = () => {
      return axios.get('/api/v1/two-factor-authentication-enabled').then((response) => {
         setRequiresConfirmation(response.data);
      });
   };

   useEffect(() => {
      twoFactorAuthenticationEnabled();
   }, []);

   useEffect(() => {
      setTwoFactorEnabled(!enabling && user.two_factor_enabled);
   }, [enabling, user]);

   useEffect(() => {
      if (!twoFactorEnabled) {
         setConfirmationCode('');
      }
   }, [twoFactorEnabled]);

   return (
      <section className={className}>
         <header>
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
               {user.two_factor_confirmed_at && !confirming
                  ? 'You have enabled two factor authentication.'
                  : twoFactorEnabled && confirming
                    ? 'Finish enabling two factor authentication.'
                    : 'You have not enabled two factor authentication.'}
            </h2>

            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
               When two factor authentication is enabled, you will be prompted for a secure, random token during
               authentication. You may retrieve this token from your phone's Google Authenticator application.
            </p>
         </header>

         {twoFactorEnabled && (
            <div>
               {qrCode && (
                  <div>
                     <div className="mt-4 max-w-xl text-sm text-gray-600 dark:text-gray-400">
                        <p className="font-semibold">
                           {confirming
                              ? "To finish enabling two factor authentication, scan the following QR code using your phone's authenticator application or enter the setup key and provide the generated OTP code."
                              : "Two factor authentication is now enabled. Scan the following QR code using your phone's authenticator application or enter the setup key."}
                        </p>
                     </div>

                     <div className="mt-4 inline-block bg-white p-2" dangerouslySetInnerHTML={{ __html: qrCode }} />

                     {setupKey && (
                        <div className="mt-4 max-w-xl text-sm text-gray-600 dark:text-gray-400">
                           <p className="font-semibold">Setup Key: {setupKey}</p>
                        </div>
                     )}

                     {confirming && (
                        <div className="mt-4">
                           <label className="form-control w-full max-w-lg">
                              <div className="label">
                                 <span className="label-text">Code</span>
                              </div>
                              <input
                                 id="code"
                                 defaultValue={confirmationCode}
                                 type="text"
                                 name="code"
                                 className="input input-bordered input-primary w-full max-w-lg"
                                 inputMode="numeric"
                                 autoFocus
                                 autoComplete="one-time-code"
                                 onChange={(e) => setConfirmationCode(e.target.value)}
                              />
                           </label>
                           <InputError messages={errors.code} className="mt-2" />
                        </div>
                     )}
                  </div>
               )}

               {recoveryCodes.length > 0 && !confirming && (
                  <div>
                     <div className="mt-4 max-w-xl text-sm text-gray-600 dark:text-gray-400">
                        <p className="font-semibold">
                           Store these recovery codes in a secure password manager. They can be used to recover access
                           to your account if your two factor authentication device is lost.
                        </p>
                     </div>

                     <div className="mt-4 grid max-w-xl gap-1 rounded-lg bg-gray-100 px-4 py-4 font-mono text-sm dark:bg-gray-900 dark:text-gray-100">
                        {recoveryCodes.map((code, index) => (
                           <div key={index}>{code}</div>
                        ))}
                     </div>
                  </div>
               )}
            </div>
         )}

         <div className="mt-5">
            {!user.two_factor_confirmed_at && !user.two_factor_enabled && !confirming && !postConfirming ? (
               <ConfirmPassword onConfirm={enableTwoFactorAuthentication}>
                  <PrimaryButton type="button" className={enabling ? 'opacity-25' : ''} disabled={enabling}>
                     Enable
                  </PrimaryButton>
               </ConfirmPassword>
            ) : (
               <div>
                  <ConfirmPassword onConfirm={confirmTwoFactorAuthentication}>
                     {confirming && (
                        <SuccessButton
                           type="button"
                           className={`me-3 ${postConfirming ? 'opacity-25' : ''}`}
                           disabled={postConfirming}
                        >
                           Confirm
                        </SuccessButton>
                     )}
                  </ConfirmPassword>

                  <ConfirmPassword onConfirm={regenerateRecoveryCodes}>
                     {recoveryCodes.length > 0 && !confirming && (
                        <SecondaryButton className="me-3">Regenerate Recovery Codes</SecondaryButton>
                     )}
                  </ConfirmPassword>

                  <ConfirmPassword onConfirm={showRecoveryCodes}>
                     {recoveryCodes.length === 0 && !confirming && user.two_factor_confirmed_at && (
                        <SecondaryButton className="me-3">Show Recovery Codes</SecondaryButton>
                     )}
                  </ConfirmPassword>

                  <ConfirmPassword onConfirm={disableTwoFactorAuthentication}>
                     {confirming && (
                        <SecondaryButton className={disabling ? 'opacity-25' : ''} disabled={disabling}>
                           Cancel
                        </SecondaryButton>
                     )}
                  </ConfirmPassword>

                  <ConfirmPassword onConfirm={disableTwoFactorAuthentication}>
                     {!confirming && user.two_factor_confirmed_at && (
                        <DangerButton className={disabling ? 'opacity-25' : ''} disabled={disabling}>
                           Disable
                        </DangerButton>
                     )}
                  </ConfirmPassword>
               </div>
            )}
         </div>
      </section>
   );
}

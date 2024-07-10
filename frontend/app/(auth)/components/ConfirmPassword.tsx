import React, { useRef, useState } from 'react';
import axios from '../../lib/axios';
import DialogModal from '../../ui/DialogModal';
import InputError from '../../ui/InputError';
import SecondaryButton from '../../ui/SecondaryButton';
import SuccessButton from '../../ui/SuccessButton';
import useAuth from '../../hooks/auth';
import { ValidationErrors } from '../../types/validation-errors';

export default function ConfirmPassword({
   title = 'Confirm Password',
   content = 'For your security, please confirm your password to continue.',
   button = 'Confirm',
   onConfirm,
   children,
}) {
   const [confirmingPassword, setConfirmingPassword] = useState(false);
   const [password, setPassword] = useState('');
   const [errors, setErrors] = useState<ValidationErrors>({});
   const [processing, setProcessing] = useState(false);
   const passwordInput = useRef(null);

   const { refetch } = useAuth();

   const startConfirmingPassword = () => {
      axios.get('/api/v1/user/confirmed-password-status').then((response) => {
         if (response.data.confirmed) {
            onConfirm();
         } else {
            setConfirmingPassword(true);
            setTimeout(() => passwordInput.current.focus(), 250);
         }
      });
   };

   const confirmPassword = () => {
      setProcessing(true);
      setErrors({});

      axios
         .post('/api/v1/user/confirm-password', {
            password: password,
         })
         .then(() => {
            setPassword('');
            setErrors({});
            setProcessing(false);

            closeModal();
            onConfirm();
            refetch();
         })
         .catch((error) => {
            console.error(error);
            setPassword(password);
            setErrors(error.response.data.errors);
            setProcessing(false);
            passwordInput.current.focus();
         });
   };

   const closeModal = () => {
      setConfirmingPassword(false);
      setPassword('');
      setErrors({});
      setProcessing(false);
   };

   return (
      <span>
         <span onClick={startConfirmingPassword}>{children}</span>

         {confirmingPassword && (
            <DialogModal show={confirmingPassword} onClose={closeModal}>
               <div className="p-6">
                  <DialogModal.Title>{title}</DialogModal.Title>

                  <DialogModal.Content>
                     {content}

                     <div className="mt-4">
                        <input
                           ref={passwordInput}
                           value={password}
                           type="password"
                           className="input input-bordered w-full max-w-xs"
                           placeholder="Password"
                           autoComplete="current-password"
                           onKeyUp={(event) => {
                              if (event.key === 'Enter') {
                                 confirmPassword();
                              }
                           }}
                           onChange={(event) => setPassword(event.target.value)}
                        />

                        <InputError messages={errors.password} className="mt-2" />
                     </div>
                  </DialogModal.Content>

                  <DialogModal.Footer>
                     <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>

                     <SuccessButton
                        className={`ms-3 ${processing ? 'opacity-25' : ''}`}
                        disabled={processing}
                        onClick={confirmPassword}
                     >
                        {button}
                     </SuccessButton>
                  </DialogModal.Footer>
               </div>
            </DialogModal>
         )}
      </span>
   );
}

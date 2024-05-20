import { useState } from 'react';
import axios from '../../../lib/axios.js';
import Modal from '../../../ui/Modal.jsx';
import DangerButton from '../../../ui/DangerButton.jsx';
import InputError from '../../../ui/InputError.jsx';
import SecondaryButton from '../../../ui/SecondaryButton.jsx';

export default function DeleteUserForm({ className = '' }) {
   const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
   const [password, setPassword] = useState('');
   const [errors, setErrors] = useState({});

   const confirmUserDeletion = () => {
      setConfirmingUserDeletion(true);
   };

   const deleteUser = (e) => {
      e.preventDefault();
      setErrors({});

      axios
         .delete('/api/v1/user', {
            data: {
               password,
            },
         })
         .then(() => {
            return (window.location.href = '/');
         })
         .catch((error) => {
            setErrors(error.response.data.errors);
         });
   };

   const closeModal = () => {
      setConfirmingUserDeletion(false);
      setPassword('');
   };

   return (
      <section className={`space-y-6 ${className}`}>
         <header>
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Delete Account</h2>

            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
               Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting
               your account, please download any data or information that you wish to retain.
            </p>
         </header>

         <DangerButton onClick={confirmUserDeletion}>Delete Account</DangerButton>

         <Modal show={confirmingUserDeletion} onClose={closeModal}>
            <form onSubmit={deleteUser} className="p-6">
               <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Are you sure you want to delete your account?
               </h2>

               <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Once your account is deleted, all of its resources and data will be permanently deleted. Please enter
                  your password to confirm you would like to permanently delete your account.
               </p>

               <div className="mt-6">
                  <input
                     className="input input-bordered w-full max-w-xs"
                     id="password"
                     type="password"
                     name="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     placeholder="Password"
                  />

                  <InputError messages={errors.password} className="mt-2" />
               </div>

               <div className="mt-6 flex justify-end">
                  <SecondaryButton type="button" onClick={closeModal}>
                     Cancel
                  </SecondaryButton>

                  <DangerButton className="ms-3">Delete Account</DangerButton>
               </div>
            </form>
         </Modal>
      </section>
   );
}

'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, ShoppingCartIcon } from '@heroicons/react/16/solid';
import { AnimatePresence, motion } from 'framer-motion';
import Breadcrumb from '../ui/Breadcrumb';
import InformationForm from './partials/InformationForm';
import ShippingForm from './partials/ShippingForm';
import PaymentForm from './partials/PaymentForm';
import { useCart } from '../hooks/cart';
import Image from 'next/image';

const Checkout = () => {
   const [firstName, setFirstName] = useState('');
   const [lastName, setLastName] = useState('');
   const [address, setAddress] = useState('');
   const [city, setCity] = useState('');
   const [zipCode, setZipCode] = useState('');
   const [errors, setErrors] = useState({});

   const [display, setDisplay] = useState(false);
   const [isOpen, setIsOpen] = useState(false);

   const [step, setStep] = useState('Information');

   const { cartItems, isLoadingCart, totalPrice } = useCart();

   const handleValidation = () => {
      let errors = {};
      let formIsValid = true;

      if (!firstName) {
         formIsValid = false;
         errors['firstName'] = 'Name field is required';
      }

      if (!lastName) {
         formIsValid = false;
         errors['lastName'] = 'Last name field is required';
      }

      if (!address) {
         formIsValid = false;
         errors['address'] = 'Address field is required';
      }

      if (!city) {
         formIsValid = false;
         errors['city'] = 'City field is required';
      }

      if (!zipCode) {
         formIsValid = false;
         errors['zipCode'] = 'Zip code field is required';
      } else if (!/^\d{2}-\d{3}$/i.test(zipCode)) {
         formIsValid = false;
         errors['zipCode'] = 'Zip code must be in the format (xx-xxx)';
      }

      setErrors(errors);
      return formIsValid;
   };

   const handleContinue = () => {
      setErrors({});
      if (step === 'Information') {
         if (!handleValidation()) {
            return;
         }
         setStep('Shipping');
      } else if (step === 'Shipping') {
         setStep('Payment');
      }
   };

   const handleBreadcrumbClick = (newStep) => {
      if (newStep === 'Information' || (newStep === 'Shipping' && step !== 'Information')) {
         setStep(newStep);
      }
   };

   if (isLoadingCart) return;

   return (
      <>
         <div className="mt-12 overflow-hidden border-b border-t bg-white shadow-sm lg:hidden dark:border-neutral-700 dark:bg-base-300">
            <div className="px-8 py-4 text-gray-900 dark:text-gray-100">
               <div className="mx-auto max-w-xl">
                  {!isOpen ? (
                     <button
                        className="flex items-center space-x-2 text-info/90 hover:text-info/60"
                        onClick={() => setIsOpen(true)}
                     >
                        <ShoppingCartIcon width={16} height={16} /> <p>Show order summary</p>{' '}
                        <ChevronDownIcon width={16} height={16} />
                     </button>
                  ) : (
                     <button
                        className="flex items-center space-x-2 text-info/90 hover:text-info/60"
                        onClick={() => setIsOpen(false)}
                     >
                        <ShoppingCartIcon width={16} height={16} /> <p>Hide order summary</p>{' '}
                        <ChevronUpIcon width={16} height={16} />
                     </button>
                  )}
               </div>
            </div>
         </div>
         <AnimatePresence>
            {isOpen && (
               <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="overflow-hidden border-b shadow-sm lg:hidden dark:border-neutral-700"
               >
                  <div className="px-8 py-4 text-gray-900 dark:text-gray-100">
                     <div className="mx-auto max-w-xl">
                        <div className="flex h-16 w-full justify-between space-x-4">
                           <div className="flex">
                              <div className="relative">
                                 <img
                                    src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                                    alt=""
                                    className="h-14 w-14 rounded object-cover"
                                 />
                                 <div className="absolute right-0 top-0 -mr-3 -mt-3 flex h-6 w-6 items-center justify-center rounded-full border border-neutral-700 bg-base-content text-[12px] font-bold text-black">
                                    2
                                 </div>
                              </div>
                              <div className="ml-4 flex py-2">
                                 <div>
                                    <p className="font-semibold">Acme Drawstring Bag</p>
                                    <p className="-mt-1 text-sm tracking-tight text-gray-400">White / 6 x 8 inch</p>
                                 </div>
                              </div>
                           </div>
                           <div className="flex items-center pb-2">
                              <p className="font-semibold">99.99 zł</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

         <div className="flex min-h-screen w-full">
            <div className="flex w-full justify-start border-neutral-200 p-8 lg:border-r dark:border-neutral-700">
               <div className="flex h-20 w-full justify-end">
                  <div className="w-full max-w-xl space-y-4 max-lg:mx-auto">
                     <Breadcrumb step={step} handleBreadcrumbClick={handleBreadcrumbClick} />
                     <p className="text-xl font-bold">{step}</p>

                     {step === 'Information' && (
                        <InformationForm
                           firstName={firstName}
                           lastName={lastName}
                           address={address}
                           city={city}
                           zipCode={zipCode}
                           setFirstName={setFirstName}
                           setLastName={setLastName}
                           setAddress={setAddress}
                           setCity={setCity}
                           setZipCode={setZipCode}
                           errors={errors}
                           setErrors={setErrors}
                        />
                     )}
                     {step === 'Shipping' && <ShippingForm />}
                     {step === 'Payment' && <PaymentForm />}

                     <div className="flex justify-end pt-8">
                        <button className="btn btn-info btn-lg text-white" onClick={handleContinue}>
                           {step !== 'Payment' ? (
                              <span>Continue to {step === 'Information' ? 'Shipping' : 'Payment'}</span>
                           ) : (
                              <span>Place order</span>
                           )}
                        </button>
                     </div>
                  </div>
               </div>
            </div>
            <div className="flex w-full p-8 max-lg:hidden">
               <div className="flex h-20 w-full flex-col">
                  <div className="w-full max-w-xl space-y-4">
                     <p className="text-xl font-bold">Order summary</p>
                     {cartItems.map((item) => (
                        <div key={item.id} className="flex h-16 w-full justify-between space-x-4 last:border-b">
                           <div className="flex">
                              <div className="relative">
                                 <Image
                                    src={item.product.main_image}
                                    alt={item.product.name}
                                    width={80}
                                    height={80}
                                    className="h-14 w-14 rounded object-cover"
                                 />
                                 <div className="absolute right-0 top-0 -mr-3 -mt-3 flex h-6 w-6 items-center justify-center rounded-full border border-neutral-700 bg-base-content text-[12px] font-bold text-black">
                                    {item.quantity}
                                 </div>
                              </div>
                              <div className="ml-4 flex py-2">
                                 <div>
                                    <p className="font-semibold">{item.product.name}</p>
                                    {/*<p className="text-sm -mt-1 text-gray-400 tracking-tight">White / 6 x 8*/}
                                    {/*    inch</p>*/}
                                 </div>
                              </div>
                           </div>
                           <div className="flex items-center pb-2">
                              <p className="font-semibold">PLN {item.total_price}</p>
                           </div>
                        </div>
                     ))}
                     <div className="border-b border-t border-neutral-200 pb-4 pt-4 dark:border-neutral-700">
                        {!display ? (
                           <button
                              className="cursor-pointer text-lg font-semibold tracking-wide underline hover:opacity-70"
                              onClick={() => setDisplay(true)}
                           >
                              Have a discount code?
                           </button>
                        ) : (
                           <div className="flex justify-between">
                              <div className="space-x-4">
                                 <label className="form-control w-full max-w-xs">
                                    <span className="mb-1 font-semibold tracking-wide">Discount Code</span>
                                    <div className="flex space-x-2">
                                       <input type="text" className="input input-bordered w-full max-w-xs" />
                                       <button onClick={() => alert('Apply')} className="btn btn-outline btn-neutral">
                                          Apply
                                       </button>
                                    </div>
                                 </label>
                              </div>
                              <div>
                                 <button
                                    className="cursor-pointer text-lg font-semibold tracking-wide underline hover:opacity-70"
                                    onClick={() => setDisplay(false)}
                                 >
                                    Cancel
                                 </button>
                              </div>
                           </div>
                        )}
                     </div>
                     <div className="border-b border-neutral-200 pb-4 dark:border-neutral-700">
                        <div className="flex items-center justify-between">
                           <div>Subtotal</div>
                           <div>99.99 zł</div>
                        </div>
                        <div className="flex items-center justify-between">
                           <div>Shipping</div>
                           <div>9.99 zł</div>
                        </div>
                        <div className="flex items-center justify-between">
                           <div>Tax</div>
                           <div>23.00 zł</div>
                        </div>
                     </div>
                     <div className="flex items-center justify-between text-lg font-bold">
                        <div>Total</div>
                        <div>{totalPrice} zł</div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default Checkout;

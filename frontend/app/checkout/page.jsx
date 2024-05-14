'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, ShoppingCartIcon } from '@heroicons/react/16/solid';
import { AnimatePresence, motion } from 'framer-motion';
import Breadcrumb from '../ui/Breadcrumb';
import InformationForm from '../ui/InformationForm';
import ShippingForm from '../ui/ShippingForm';
import PaymentForm from '../ui/PaymentForm';

const Checkout = () => {
   const [display, setDisplay] = useState(false);
   const [isOpen, setIsOpen] = useState(false);

   const [step, setStep] = useState('Information');

   const handleContinue = () => {
      if (step === 'Information') {
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

   return (
      <>
         <div className="bg-white dark:bg-base-300 border-b border-t dark:border-neutral-700 overflow-hidden shadow-sm lg:hidden mt-12">
            <div className="py-4 px-8 text-gray-900 dark:text-gray-100">
               <div className="max-w-xl mx-auto">
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
                  className="border-b dark:border-neutral-700 overflow-hidden shadow-sm lg:hidden"
               >
                  <div className="py-4 px-8 text-gray-900 dark:text-gray-100">
                     <div className="max-w-xl mx-auto">
                        <div className="flex w-full h-16 justify-between space-x-4">
                           <div className="flex">
                              <div className="relative">
                                 <img
                                    src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                                    alt=""
                                    className="w-14 h-14 object-cover rounded"
                                 />
                                 <div className="absolute right-0 top-0 -mr-3 -mt-3 h-6 w-6 rounded-full bg-base-content border border-neutral-700 text-[12px] flex items-center justify-center text-black font-bold">
                                    2
                                 </div>
                              </div>
                              <div className="flex py-2 ml-4">
                                 <div>
                                    <p className="font-semibold">Acme Drawstring Bag</p>
                                    <p className="text-sm -mt-1 text-gray-400 tracking-tight">White / 6 x 8 inch</p>
                                 </div>
                              </div>
                           </div>
                           <div className="flex items-center pb-2">
                              <p className="font-semibold">PLN 99.99</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

         <div className="flex w-full min-h-screen">
            <div className="flex w-full justify-start p-8 lg:border-r border-neutral-200 dark:border-neutral-700">
               <div className="flex justify-end w-full h-20">
                  <div className="max-w-xl max-lg:mx-auto w-full space-y-4">
                     <Breadcrumb step={step} handleBreadcrumbClick={handleBreadcrumbClick} />
                     <p className="text-xl font-bold">{step}</p>

                     {step === 'Information' && <InformationForm />}
                     {step === 'Shipping' && <ShippingForm />}
                     {step === 'Payment' && <PaymentForm />}

                     <div className="flex justify-end pt-8">
                        <button className="btn btn-info btn-lg text-white" onClick={handleContinue}>
                           Continue to {step === 'Information' ? 'Shipping' : 'Payment'}
                        </button>
                     </div>
                  </div>
               </div>
            </div>
            <div className="max-lg:hidden flex w-full p-8">
               <div className="flex flex-col w-full h-20">
                  <div className="max-w-xl w-full space-y-4">
                     <p className="text-xl font-bold">Order summary</p>
                     <div className="flex w-full h-16 justify-between space-x-4 last:border-b">
                        <div className="flex">
                           <div className="relative">
                              <img
                                 src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                                 alt=""
                                 className="w-14 h-14 object-cover rounded"
                              />
                              <div className="absolute right-0 top-0 -mr-3 -mt-3 h-6 w-6 rounded-full bg-base-content border border-neutral-700 text-[12px] flex items-center justify-center text-black font-bold">
                                 2
                              </div>
                           </div>
                           <div className="flex py-2 ml-4">
                              <div>
                                 <p className="font-semibold">Acme Drawstring Bag</p>
                                 <p className="text-sm -mt-1 text-gray-400 tracking-tight">White / 6 x 8 inch</p>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center pb-2">
                           <p className="font-semibold">PLN 99.99</p>
                        </div>
                     </div>
                     <div className="flex w-full h-20 justify-between space-x-4 last:border-b border-neutral-200 dark:border-neutral-700">
                        <div className="flex">
                           <div className="rounded-lg relative">
                              <img
                                 src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                                 alt=""
                                 className="w-14 h-14 object-cover rounded-lg"
                              />
                              <div className="absolute right-0 top-0 -mr-3 -mt-3 h-6 w-6 rounded-full bg-base-content border border-neutral-700 text-[12px] flex items-center justify-center text-black font-bold">
                                 1
                              </div>
                           </div>
                           <div className="flex py-2 ml-4">
                              <div>
                                 <p className="font-semibold">Acme Drawstring Bag</p>
                                 <p className="text-sm -mt-1 text-gray-400 tracking-tight">White / 6 x 8 inch</p>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center pb-2">
                           <p className="font-semibold">PLN 99.99</p>
                        </div>
                     </div>
                     <div className="pt-4 pb-4 border-t border-b border-neutral-200 dark:border-neutral-700">
                        {!display ? (
                           <button
                              className="cursor-pointer underline tracking-wide font-semibold text-lg hover:opacity-70"
                              onClick={() => setDisplay(true)}
                           >
                              Have a discount code?
                           </button>
                        ) : (
                           <div className="flex justify-between">
                              <div className="space-x-4">
                                 <label className="form-control w-full max-w-xs">
                                    <span className="font-semibold tracking-wide mb-1">Discount Code</span>
                                    <div className="flex space-x-2">
                                       <input type="text" className="input input-bordered w-full max-w-xs" />
                                       <button onClick={() => alert('Apply')} className="btn btn-neutral btn-outline">
                                          Apply
                                       </button>
                                    </div>
                                 </label>
                              </div>
                              <div>
                                 <button
                                    className="cursor-pointer underline tracking-wide font-semibold text-lg hover:opacity-70"
                                    onClick={() => setDisplay(false)}
                                 >
                                    Cancel
                                 </button>
                              </div>
                           </div>
                        )}
                     </div>
                     <div className="border-b border-neutral-200 dark:border-neutral-700 pb-4">
                        <div className="flex justify-between items-center">
                           <div>Subtotal</div>
                           <div>99.99 zł</div>
                        </div>
                        <div className="flex justify-between items-center">
                           <div>Shipping</div>
                           <div>9.99 zł</div>
                        </div>
                        <div className="flex justify-between items-center">
                           <div>Tax</div>
                           <div>23.00 zł</div>
                        </div>
                     </div>
                     <div className="flex justify-between items-center text-lg font-bold">
                        <div>Total</div>
                        <div>129.99 zł</div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default Checkout;

'use client';

import { Dialog, Transition } from '@headlessui/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { MinusIcon, PlusIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import CloseCart from '../ui/CloseCart';
import { ShoppingCartIcon } from '@heroicons/react/16/solid';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../hooks/cart';
import axios from '../lib/axios';

export default function CartMenu({ className = '' }) {
   const router = useRouter();
   const pathname = usePathname();
   const searchParams = useSearchParams();
   const [isOpen, setIsOpen] = useState(false);
   const openCart = () => setIsOpen(true);
   const closeCart = () => setIsOpen(false);
   const [isLoading, setIsLoading] = useState(false);

   const {
      cartItems,
      isLoadingCart,
      cartItemsCount,
      handleRemoveItemFromCart,
      incrementQuantity,
      decrementQuantity,
      totalPrice,
   } = useCart();

   const handleCheckout = () => {
      setIsLoading(true);
      axios
         .post('/api/v1/checkout')
         .then((response) => {
            router.push(response.data.message);
         })
         .catch((error) => {
            console.error(error);
         })
         .finally(() => setIsLoading(false));
   };

   useEffect(() => {
      setIsOpen(false);
   }, [pathname, searchParams]);

   // if (isLoadingCart) return;

   return (
      <>
         <button
            onClick={openCart}
            aria-label="Open mobile menu"
            className="flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white"
         >
            <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white">
               <ShoppingCartIcon className="h-5 w-5" />

               {cartItemsCount ? (
                  <div className="absolute right-0 top-0 -mr-2 -mt-2 h-4 w-4 rounded bg-info/70 text-[11px] font-medium text-white">
                     {cartItemsCount}
                  </div>
               ) : null}
            </div>
         </button>
         <Transition show={isOpen}>
            <Dialog onClose={closeCart} className="relative z-50">
               <Transition.Child
                  as={Fragment}
                  enter="transition-all ease-in-out duration-300"
                  enterFrom="opacity-0 backdrop-blur-none"
                  enterTo="opacity-100 backdrop-blur-[.5px]"
                  leave="transition-all ease-in-out duration-200"
                  leaveFrom="opacity-100 backdrop-blur-[.5px]"
                  leaveTo="opacity-0 backdrop-blur-none"
               >
                  <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
               </Transition.Child>
               <Transition.Child
                  as={Fragment}
                  enter="transition-all ease-in-out duration-300"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition-all ease-in-out duration-200"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
               >
                  <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l border-neutral-200 bg-white/80 px-4 py-2 text-black backdrop-blur-xl md:w-[390px] dark:border-neutral-700 dark:bg-black/80 dark:text-white">
                     <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold">My Cart</p>

                        <button aria-label="Close cart" onClick={closeCart}>
                           <CloseCart />
                        </button>
                     </div>

                     {!cartItems?.length && (
                        <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
                           <ShoppingCartIcon className="h-16" />
                           <p className="mt-6 text-center text-2xl font-bold">Your cart is empty.</p>
                        </div>
                     )}

                     {cartItems?.length > 0 && (
                        <div className="flex h-full flex-col justify-between overflow-hidden p-1">
                           <ul className="flex-grow overflow-auto py-4">
                              {cartItems.map((item, i) => (
                                 <li
                                    key={i}
                                    className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700"
                                 >
                                    <div className="relative flex w-full flex-row justify-between px-1 py-4">
                                       <div className="absolute z-40 -mt-2 ml-[55px]">
                                          <button
                                             className="ease flex h-[17px] w-[17px] items-center justify-center rounded-full bg-neutral-500 transition-all duration-200"
                                             onClick={() => handleRemoveItemFromCart(item.id, item.product.id)}
                                          >
                                             <XMarkIcon className="hover:text-accent-3 mx-[1px] h-4 w-4 text-white dark:text-black" />
                                          </button>
                                       </div>
                                       <Link
                                          href={`/p/${item.product.url}`}
                                          onClick={closeCart}
                                          className="z-30 flex flex-row space-x-4"
                                       >
                                          <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                                             <Image
                                                className="h-full w-full object-cover"
                                                width={64}
                                                height={64}
                                                alt={item.product.name}
                                                src={item.product.main_image}
                                             />
                                          </div>

                                          <div className="flex flex-1 flex-col text-base">
                                             <span className="leading-tight">{item.product.name}</span>
                                          </div>
                                       </Link>
                                       <div className="flex h-16 flex-col justify-between">
                                          {item.total_price}
                                          <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                                             {item.quantity > 1 ? (
                                                <button
                                                   disabled={item.quantity <= 1}
                                                   onClick={() => decrementQuantity(item.id, item.product.id)}
                                                   className="ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full px-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80"
                                                >
                                                   <MinusIcon />
                                                </button>
                                             ) : (
                                                <button
                                                   onClick={() => handleRemoveItemFromCart(item.id, item.product.id)}
                                                   className="ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full px-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80"
                                                >
                                                   <TrashIcon />
                                                </button>
                                             )}
                                             <p className="w-6 text-center">
                                                <span className="w-full text-sm">{item.quantity}</span>
                                             </p>
                                             <button
                                                onClick={() => incrementQuantity(item.id, item.product.id)}
                                                className="ease hover:opacity-80' flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full px-2 transition-all duration-200 hover:border-neutral-800"
                                             >
                                                <PlusIcon />
                                             </button>
                                             {/*<EditItemQuantityButton item={item} type="plus" />*/}
                                          </div>
                                       </div>
                                    </div>
                                 </li>
                              ))}
                           </ul>
                           <div className="py-4 text-sm text-neutral-500 dark:text-neutral-400">
                              <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 dark:border-neutral-700">
                                 <p>Taxes</p>
                              </div>
                              <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                                 <p>Shipping</p>
                                 <p className="text-right">Calculated at checkout</p>
                              </div>
                              <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                                 <p>Total</p>
                                 {totalPrice}
                              </div>
                           </div>
                           {/*<Link*/}
                           {/*   href={'/checkout'}*/}
                           {/*   className="btn btn-info w-full p-3 text-center text-sm font-medium text-white"*/}
                           {/*>*/}
                           {/*   Proceed to Checkout*/}
                           {/*</Link>*/}
                           <button
                              disabled={isLoading}
                              onClick={handleCheckout}
                              className="btn btn-info w-full p-3 text-center text-sm font-medium text-white"
                           >
                              Proceed to Checkout
                           </button>
                        </div>
                     )}
                  </Dialog.Panel>
               </Transition.Child>
            </Dialog>
         </Transition>
      </>
   );
}

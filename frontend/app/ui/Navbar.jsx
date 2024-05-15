'use client';

import { Suspense, useState } from 'react';
import Dropdown from './Dropdown';
import NavLink from './NavLink';
import ResponsiveNavLink from './ResponsiveNavLink';
import { useAuth } from '../hooks/auth.js';
import Loading from './Loading.jsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SearchInput from '../ui/SearchInput';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import CartMenu from './CartMenu';
import Image from 'next/image';
import Bookmark from './Bookmark';

export default function Navbar() {
   const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

   const pathname = usePathname();

   const { user, logout, isLoading, isFetching, isValidating } = useAuth();

   return (
      <nav>
         <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
               <div className="hidden lg:flex">
                  <div className="shrink-0 flex items-center">
                     <Link href="/">
                        <ShoppingBagIcon className="block h-9 w-auto dark:text-gray-400" />
                     </Link>
                  </div>

                  <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                     <NavLink href="/products" active={pathname.startsWith('/products') || pathname.startsWith('/p/')}>
                        Products
                     </NavLink>
                  </div>
               </div>

               {/*<div className="w-full max-w-4xl hidden lg:flex sm:justify-center sm:items-center ms-4">*/}
               {/*   <SearchInput />*/}
               {/*</div>*/}

               <div className="hidden lg:flex sm:items-center sm:ms-6 space-x-2">
                  {user && <Bookmark />}
                  <CartMenu />
                  <div className="relative">
                     {!user ? (
                        <Link
                           className={
                              'btn btn-default btn-outline btn-sm tracking-widest font-bold ' +
                              (isFetching ? 'hidden' : '')
                           }
                           href={'/login'}
                        >
                           Login
                        </Link>
                     ) : (
                        <Dropdown>
                           <Dropdown.Trigger>
                              <div className="min-w-10">
                                 <Image
                                    title={user.name}
                                    className="rounded-full object-cover w-10 h-10 cursor-pointer"
                                    src={user.profile_photo_url}
                                    alt={user.name}
                                    width={36}
                                    height={36}
                                 />
                              </div>
                           </Dropdown.Trigger>

                           <Dropdown.Content>
                              <Dropdown.Link href="/admin">Admin Panel</Dropdown.Link>
                              <Dropdown.Link href="/orders">My Orders</Dropdown.Link>
                              <Dropdown.Link href="/profile">Profile</Dropdown.Link>
                              <Dropdown.Link href="#" onClick={logout}>
                                 Log Out
                              </Dropdown.Link>
                           </Dropdown.Content>
                        </Dropdown>
                     )}
                  </div>
               </div>

               <div className="flex w-full justify-between items-center lg:hidden">
                  <div>
                     <button
                        onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                        className="btn border-gray-700 hover:border-gray-700 inline-flex items-center justify-center p-2 transition-all ease-in-out"
                     >
                        <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                           <path
                              className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 6h16M4 12h16M4 18h16"
                           />
                           <path
                              className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                           />
                        </svg>
                     </button>
                  </div>

                  {/*<div className="w-full px-2">*/}
                  {/*   <SearchInput />*/}
                  {/*</div>*/}

                  <div className="block flex lg:hidden space-x-2">
                     <Suspense fallback={null}>
                        {user && <Bookmark />}
                        <CartMenu />
                     </Suspense>
                  </div>
               </div>
            </div>
         </div>

         <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' lg:hidden'}>
            <div className="pt-2 pb-3 space-y-1">
               <ResponsiveNavLink href="/" active={pathname === '/'}>
                  Home
               </ResponsiveNavLink>
               <ResponsiveNavLink
                  href="/products"
                  active={pathname.startsWith('/products') || pathname.startsWith('/p/')}
               >
                  Products
               </ResponsiveNavLink>
            </div>

            <div className="pt-3 pb-1 border-t border-gray-200 dark:border-gray-600">
               {!user ? (
                  <ResponsiveNavLink href="/login">Login</ResponsiveNavLink>
               ) : (
                  <div>
                     <div className="px-4">
                        <div className="font-medium text-base text-gray-800 dark:text-gray-200">{user.name}</div>
                        <div className="font-medium text-sm text-gray-500">{user.email}</div>
                     </div>

                     <div className="mt-3 space-y-1">
                        <ResponsiveNavLink href="/admin">Admin Panel</ResponsiveNavLink>
                        <ResponsiveNavLink href="/orders">My Orders</ResponsiveNavLink>
                        <ResponsiveNavLink href="/profile">Profile</ResponsiveNavLink>
                        <ResponsiveNavLink href="#" onClick={logout}>
                           Log Out
                        </ResponsiveNavLink>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </nav>
   );
}

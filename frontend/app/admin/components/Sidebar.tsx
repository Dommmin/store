'use client';

import {
   Bars3Icon,
   CubeIcon,
   GiftIcon,
   PencilSquareIcon,
   PowerIcon,
   PuzzlePieceIcon,
   RectangleGroupIcon,
   Squares2X2Icon,
   TruckIcon,
   UserGroupIcon,
   XMarkIcon,
} from '@heroicons/react/24/outline';
import useAuth from '../../hooks/auth';
import { ShoppingCartIcon } from '@heroicons/react/16/solid';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SideNavLink from '../../ui/SideNavLink';
import { LayoutDashboardIcon } from 'lucide-react';

export default function Sidebar({ setIsOpen, isOpen }) {
   const openMobileMenu = () => setIsOpen(true);
   const closeMobileMenu = () => setIsOpen(false);

   const pathname = usePathname();

   const { logout } = useAuth();

   const menu = [
      {
         name: 'Dashboard',
         icon: <LayoutDashboardIcon className="h-5" />,
         href: '/admin',
         current: pathname === '/admin',
      },
      {
         name: 'Brands',
         icon: <PuzzlePieceIcon className="h-5" />,
         href: '/admin/brands',
         current: pathname.startsWith('/admin/brands'),
      },
      {
         name: 'Collections',
         icon: <Squares2X2Icon className="h-5" />,
         href: '/admin/collections',
         current: pathname.startsWith('/admin/collections'),
      },
      {
         name: 'Categories',
         icon: <CubeIcon className="h-5" />,
         href: '/admin/categories',
         current: pathname.startsWith('/admin/categories'),
      },
      {
         name: 'Attributes',
         icon: <RectangleGroupIcon className="h-5" />,
         href: '/admin/attributes',
         current: pathname.startsWith('/admin/attributes'),
      },
      {
         name: 'Products',
         icon: <GiftIcon className="h-5" />,
         href: '/admin/products',
         current: pathname.startsWith('/admin/products'),
      },
      {
         name: 'Customers',
         icon: <UserGroupIcon className="h-5" />,
         href: '/admin/customers',
         current: pathname.startsWith('/admin/customers'),
      },
      {
         name: 'Orders',
         icon: <ShoppingCartIcon className="h-5" />,
         href: '/admin/orders',
         current: pathname.startsWith('/admin/orders'),
      },
      {
         name: 'Shipments',
         icon: <TruckIcon className="h-5" />,
         href: '/admin/shipments',
         current: pathname.startsWith('/admin/shipments'),
      },
      {
         name: 'Reviews',
         icon: <PencilSquareIcon className="h-5" />,
         href: '/admin/reviews',
         current: pathname.startsWith('/admin/reviews'),
      },
   ];

   return (
      <>
         <div className="flex items-center justify-between">
            <button
               onClick={isOpen ? closeMobileMenu : openMobileMenu}
               aria-label="Open mobile menu"
               className="flex h-11 w-11 items-center justify-center text-black transition-colors hover:scale-110 hover:bg-base-200 dark:text-white"
            >
               <Bars3Icon className="h-6" />
            </button>
            <div className="mr-2">
               <button onClick={logout} title="Sign out">
                  <PowerIcon className="h-6 text-error hover:text-error/80" />
               </button>
            </div>
         </div>

         {isOpen && (
            <div className="fixed bottom-0 left-0 top-0 flex h-full w-full flex-col border-r border-neutral-200 bg-base-300 md:w-[250px] dark:border-neutral-700">
               <button
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-black transition-colors hover:scale-110 hover:bg-base-100 md:hidden dark:text-white"
                  onClick={closeMobileMenu}
                  aria-label="Close mobile menu"
               >
                  <XMarkIcon className="h-6" />
               </button>

               <Link href="/">
                  <div className="glass flex items-center justify-center border-b-2 border-neutral-200 bg-success/30 p-4 hover:bg-success/50 dark:border-neutral-700">
                     <ShoppingCartIcon className="h-6" />
                  </div>
               </Link>
               <div className="space-y-1 pt-4">
                  {menu.map((item, index) => (
                     <ul key={index} className="pr-2">
                        <li>
                           <SideNavLink href={item.href} active={item.current}>
                              {item.icon}&nbsp;&nbsp;{item.name}
                           </SideNavLink>
                        </li>
                     </ul>
                  ))}
               </div>
            </div>
         )}
      </>
   );
}

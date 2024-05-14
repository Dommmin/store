'use client';

import {
   Bars3Icon,
   CubeIcon,
   PencilSquareIcon,
   PowerIcon,
   PuzzlePieceIcon,
   RectangleGroupIcon,
   Squares2X2Icon,
   TruckIcon,
   UserGroupIcon,
   XMarkIcon,
   GiftIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/auth';
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
         <div className="flex justify-between items-center">
            <button
               onClick={isOpen ? closeMobileMenu : openMobileMenu}
               aria-label="Open mobile menu"
               className="flex h-11 w-11 items-center justify-center text-black transition-colors dark:text-white hover:scale-110 hover:bg-base-200"
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
            <div className="fixed bottom-0 left-0 top-0 flex h-full w-full flex-col md:w-[250px] bg-base-300 border-r border-neutral-200 dark:border-neutral-700">
               <button
                  className="md:hidden flex h-11 w-11 items-center justify-center text-black transition-colors dark:text-white hover:scale-110 hover:bg-base-100 rounded-lg"
                  onClick={closeMobileMenu}
                  aria-label="Close mobile menu"
               >
                  <XMarkIcon className="h-6" />
               </button>

               <Link href="/">
                  <div className="flex justify-center items-center p-4 border-b-2 border-neutral-200 dark:border-neutral-700 bg-success/30 hover:bg-success/50 glass">
                     <ShoppingCartIcon className="h-6" />
                  </div>
               </Link>
               <div className="pt-4 space-y-1">
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

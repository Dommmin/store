import Link from 'next/link';

export default function SideNavLink({ active = false, className = '', children, ...props }) {
   return (
      <Link
         {...props}
         className={
            'inline-flex w-full items-center py-1 pl-4 transition duration-150 ease-in-out focus:outline-none ' +
            (active
               ? 'rounded-r-badge bg-success/80'
               : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-gray-300 dark:focus:border-gray-700 dark:focus:text-gray-300 ') +
            className
         }
      >
         {children}
      </Link>
   );
}

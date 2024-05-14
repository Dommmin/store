import Link from 'next/link';

export default function SideNavLink({ active = false, className = '', children, ...props }) {
   return (
      <Link
         {...props}
         className={
            'w-full pl-4 inline-flex items-center py-1 transition duration-150 ease-in-out focus:outline-none ' +
            (active
               ? 'bg-success/80 rounded-r-badge'
               : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700 ') +
            className
         }
      >
         {children}
      </Link>
   );
}

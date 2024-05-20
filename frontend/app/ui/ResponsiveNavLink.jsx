import Link from 'next/link';

export default function ResponsiveNavLink({ active = false, className = '', children, ...props }) {
   return (
      <Link
         {...props}
         className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
            active
               ? 'focus:white border-info bg-info text-white focus:border-info focus:bg-info dark:bg-info dark:text-white dark:focus:border-info dark:focus:bg-info dark:focus:text-white'
               : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 focus:border-gray-300 focus:bg-gray-50 focus:text-gray-800 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200 dark:focus:border-gray-600 dark:focus:bg-gray-700 dark:focus:text-gray-200'
         } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
      >
         {children}
      </Link>
   );
}

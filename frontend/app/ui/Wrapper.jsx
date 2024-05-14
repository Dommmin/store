export default function Wrapper({ children, className = '', maxWidth = 'max-w-7xl', paddingY = 'py-8' }) {
   return (
      <div className={`${paddingY}`}>
         <div className={`${maxWidth} mx-auto sm:px-6 lg:px-8`}>
            <div className="bg-base-300 border-t border-b sm:border dark:border-neutral-700 overflow-hidden shadow-sm sm:rounded-lg">
               <div className={`p-8 text-gray-900 dark:text-gray-100 ${className}`}>{children}</div>
            </div>
         </div>
      </div>
   );
}

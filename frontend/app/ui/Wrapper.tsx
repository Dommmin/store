export default function Wrapper({ children, className = '', maxWidth = 'max-w-7xl', paddingY = 'py-8' }) {
   return (
      <div className={`${paddingY}`}>
         <div className={`${maxWidth} mx-auto sm:px-6 lg:px-8`}>
            <div className="overflow-hidden border-b border-t bg-base-300 shadow-sm sm:rounded-lg sm:border dark:border-neutral-700">
               <div className={`p-8 text-gray-900 dark:text-gray-100 ${className}`}>{children}</div>
            </div>
         </div>
      </div>
   );
}

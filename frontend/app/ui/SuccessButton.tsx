export default function SuccessButton({ className = '', disabled = false, children, ...props }) {
   return (
      <button
         {...props}
         className={
            `btn btn-success btn-sm font-bold tracking-widest text-white ${disabled && 'opacity-25'} ` + className
         }
         disabled={disabled}
      >
         {children}
      </button>
   );
}

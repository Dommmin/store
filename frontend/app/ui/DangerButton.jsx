export default function DangerButton({ className = '', disabled, children, ...props }) {
   return (
      <button
         {...props}
         className={
            `btn btn-error btn-sm font-bold tracking-widest text-white ${disabled && 'opacity-25'} ` + className
         }
         disabled={disabled}
      >
         {children}
      </button>
   );
}

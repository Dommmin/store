export default function SecondaryButton({ className = '', disabled, children, ...props }) {
   return (
      <button
         {...props}
         className={`btn-default btn btn-outline btn-sm tracking-widest ${disabled && 'opacity-25'} ` + className}
         disabled={disabled}
      >
         {children}
      </button>
   );
}

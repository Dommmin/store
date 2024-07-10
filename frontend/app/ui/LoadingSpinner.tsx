export default function LoadingSpinner({ className = '' }) {
   return (
      <div className={'flex items-center justify-center ' + className}>
         <span className="loading loading-spinner text-info" />
      </div>
   );
}

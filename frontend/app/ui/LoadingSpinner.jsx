export default function LoadingSpinner({ className = '' }) {
   return (
      <div className={'flex justify-center items-center ' + className}>
         <span className="loading loading-spinner text-primary"></span>
      </div>
   );
}

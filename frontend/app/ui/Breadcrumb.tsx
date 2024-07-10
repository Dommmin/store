export default function Breadcrumb({ step, handleBreadcrumbClick }) {
   return (
      <div className="breadcrumbs text-sm">
         <ul>
            <li>
               <button
                  className={`${step === 'Information' ? 'text-blue-500' : 'hover:opacity-80'}`}
                  onClick={() => handleBreadcrumbClick('Information')}
                  disabled={step === 'Information'}
               >
                  Information
               </button>
            </li>
            <li>
               <button
                  className={`${
                     step === 'Shipping'
                        ? 'text-blue-500'
                        : step === 'Information'
                          ? 'cursor-default text-gray-400'
                          : 'hover:opacity-80'
                  }`}
                  onClick={() => handleBreadcrumbClick('Shipping')}
                  disabled={step === 'Shipping' || step === 'Shipping'}
               >
                  Shipping
               </button>
            </li>
            <li>
               <button
                  className={`${step === 'Payment' ? 'cursor-default text-blue-500' : 'cursor-default text-gray-400'}`}
                  onClick={() => handleBreadcrumbClick('Payment')}
                  disabled={true}
               >
                  Payment
               </button>
            </li>
         </ul>
      </div>
   );
}

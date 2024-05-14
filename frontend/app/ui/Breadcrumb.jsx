export default function Breadcrumb({ step, handleBreadcrumbClick }) {
   return (
      <div className="text-sm breadcrumbs">
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
                          ? 'text-gray-400 cursor-default'
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
                  className={`${step === 'Payment' ? 'text-blue-500 cursor-default' : 'text-gray-400 cursor-default'}`}
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

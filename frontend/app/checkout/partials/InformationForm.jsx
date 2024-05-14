export default function InformationForm() {
   return (
      <>
         <div className="flex space-x-4">
            <input
               className="input input-bordered w-full max-w-xs"
               type="text"
               placeholder="First name"
               autoComplete="given-name"
            />

            <input
               className="input input-bordered w-full max-w-xs"
               type="text"
               placeholder="Last name"
               autoComplete="family-name"
            />
         </div>
         <div>
            <input
               className="input input-bordered w-full"
               type="text"
               placeholder="Address"
               autoComplete="address-line1"
            />
         </div>
         <div>
            <input
               className="input input-bordered w-full"
               type="text"
               placeholder="Apartment, suite, etc. (optional)"
               autoComplete="address-line2"
            />
         </div>
         <div className="flex space-x-4">
            <input
               className="input input-bordered w-full max-w-xs"
               type="text"
               placeholder="State"
               autoComplete="address-level1"
            />
            <input
               className="input input-bordered w-full max-w-xs"
               type="text"
               placeholder="ZIP code"
               autoComplete="postal-code"
            />
            <input
               className="input input-bordered w-full max-w-xs"
               type="text"
               placeholder="City"
               autoComplete="address-level2"
            />
         </div>
      </>
   );
}

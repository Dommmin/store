export default function InformationForm({ ...props }) {
   return (
      <div className="w-full max-w-xl space-y-4">
         <div className="flex space-x-4">
             <div className="w-full">
                 <input
                     onChange={(e) => {
                         props.setErrors({ ...props.errors, firstName: '' });
                         props.setFirstName(e.target.value)}
                     }
                     value={props.firstName}
                     className={'input input-bordered w-full max-w-xs ' +
                         (props.errors.firstName ? 'input-error' : '')
                    }
                     type="text"
                     placeholder="First name"
                     autoComplete="given-name"
                 />
                 <p className="label-text text-error p-1">{props.errors.firstName}</p>
             </div>
             <div className="w-full">
                 <input
                     onChange={(e) => {
                         props.setErrors({ ...props.errors, lastName: '' });
                         props.setLastName(e.target.value)}
                     }
                     value={props.lastName}
                     className={'input input-bordered w-full max-w-xs ' +
                         (props.errors.lastName ? 'input-error' : '')
                     }
                     type="text"
                     placeholder="Last name"
                     autoComplete="family-name"
                 />
                 <p className="label-text text-error p-1">{props.errors.lastName}</p>
             </div>
         </div>
          <div>
              <input
                  onChange={(e) => {
                      props.setErrors({ ...props.errors, address: '' });
                      props.setAddress(e.target.value)}
                  }
                  value={props.address}
                  className={'input input-bordered w-full max-w-xl ' +
                      (props.errors.address ? 'input-error' : '')
                  }
                  type="text"
                  placeholder="Address"
                  autoComplete="address-line1"
              />
              <p className="label-text text-error p-1">{props.errors.address}</p>
          </div>
          <div>
              <input
                  className='input input-bordered w-full max-w-xl'
                  type="text"
                  placeholder="Apartment, suite, etc. (optional)"
                  autoComplete="address-line2"
              />
          </div>
          <div className="w-full max-w-xl grid grid-cols-3 gap-4">
              <div className="col-span-1">
                  <input
                      onChange={(e) => {
                          props.setErrors({ ...props.errors, zipCode: '' });
                          props.setZipCode(e.target.value)}
                      }
                      value={props.zipCode}
                      className={'input input-bordered w-full max-w-xs ' +
                          (props.errors.zipCode ? 'input-error' : '')
                      }
                      type="text"
                      placeholder="ZIP code"
                      autoComplete="postal-code"
                  />
                  <p className="label-text text-error p-1">{props.errors.zipCode}</p>
              </div>

              <div className="col-span-2">
                  <input
                      onChange={(e) => {
                          props.setErrors({ ...props.errors, city: '' });
                          props.setCity(e.target.value)}
                      }
                      value={props.city}
                      className={'input input-bordered w-full max-w-xs ' +
                          (props.errors.city ? 'input-error' : '')
                      }
                      type="text"
                      placeholder="City"
                      autoComplete="address-level2"
                  />
                  <p className="label-text text-error p-1">{props.errors.city}</p>
              </div>
          </div>
      </div>
   );
}

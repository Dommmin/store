export default function Attributes({ ...props }) {
   return (
      <div>
         <div className="mb-4 flex justify-end">
            <button onClick={props.addAttribute} className="btn btn-info btn-sm w-full text-white">
               Add attribute
            </button>
         </div>
         <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-4">
            {props.selectedAttributes.map((selected, index) => (
               <div className="flex space-x-2 lg:space-x-4" key={index}>
                  <select
                     className="select select-bordered w-full"
                     value={selected.attribute}
                     onChange={(e) => props.updateAttribute(index, e.target.value)}
                  >
                     <option selected disabled value="">
                        Select Attribute
                     </option>
                     {props.attributes.map((attribute) => (
                        <option key={attribute.id} value={attribute.id}>
                           {attribute.name.toUpperCase()}
                        </option>
                     ))}
                  </select>
                  {selected.attribute && (
                     <select
                        className="select select-bordered w-full"
                        value={selected.value}
                        onChange={(e) => props.updateValue(index, e.target.value)}
                     >
                        <option selected disabled value="">
                           Select Value
                        </option>
                        {props.attributeValues[index] &&
                           props.attributeValues[index].values.map((value) => (
                              <option key={value.id} value={value.name}>
                                 {value.name.toUpperCase()}
                              </option>
                           ))}
                     </select>
                  )}
                  <button onClick={() => props.removeAttribute(index)} className="btn btn-error text-white">
                     Remove
                  </button>
               </div>
            ))}
         </div>
      </div>
   );
}

import { Reorder } from 'framer-motion';
import UploadItem from '../../../../ui/UploadItem';

export default function Images({ ...props }) {
   return (
      <div>
         <div>
            <label
               htmlFor="image"
               className="flex items-center justify-center w-full h-44 bg-base-100 border-2 border-dashed border-gray-200 text-gray-500 font-medium cursor-pointer rounded-lg dark:text-gray-300 dark:border-gray-600 dark:placeholder-gray-400"
               onDragOver={(e) => e.preventDefault()}
               onDrop={(e) => {
                  e.preventDefault();
                  props.handleDroppedFiles(e.dataTransfer.files);
               }}
            >
               Drop or click to upload files
            </label>
            <input
               type="file"
               accept="image/*"
               name="image"
               id="image"
               className="sr-only"
               multiple
               onChange={(e) => props.handleDroppedFiles(e.target.files)}
            />
         </div>

         <Reorder.Group values={props.images} onReorder={props.setImages} axis="y" className="mt-4 space-y-4">
            {props.images.map((image, index) => (
               <Reorder.Item key={image.name} value={image} className="cursor-grab">
                  <UploadItem image={image} key={image.name} onRemove={() => props.removeImage(index)} />
               </Reorder.Item>
            ))}
         </Reorder.Group>
      </div>
   );
}

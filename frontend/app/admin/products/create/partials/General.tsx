// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import uploadPlugin from '../../../../plugins/CustomUploadPlugin';

import React from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Brand, Category, Collection, Product } from '../../../../types/product';

interface Props {
   categories: Category[];
   brands: Brand[];
   collections: Collection[];
   register: UseFormRegister<Product>;
   errors: FieldErrors<Product>;
}

export default function General({ categories, brands, collections, register, errors }: Props) {
   return (
      <div className="space-y-4">
         <div>
            <input
               {...register('name', { required: 'Name is required' })}
               className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
               type="text"
               placeholder="Name"
            />
         </div>
         <div className="space-x-4">
            <input
               {...register('model', { required: 'Model is required' })}
               className="input input-bordered w-full max-w-xs"
               type="text"
               placeholder="Model"
            />
         </div>
         <div>
            <input
               {...register('price', { required: 'Price is required' })}
               type="number"
               min={1}
               placeholder="Price"
               className="input input-bordered w-full max-w-xs"
            />
         </div>
         <div className="flex space-x-4">
            <select
               {...register('brand_id', { required: 'Brand is required' })}
               className="select select-bordered w-full max-w-xs"
            >
               <option value="">- Select Brand -</option>
               {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                     {brand.name}
                  </option>
               ))}
            </select>
            <select
               {...register('category_id', { required: 'Category is required' })}
               className="select select-bordered w-full max-w-xs"
            >
               <option value="">- Select Category -</option>
               {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                     {category.name}
                  </option>
               ))}
            </select>
            <select
               {...register('collection_id', { required: 'Collection is required' })}
               className="select select-bordered w-full max-w-xs"
            >
               <option value="">- Select Collection -</option>
               {collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                     {collection.name}
                  </option>
               ))}
            </select>
         </div>
         <div className="space-x-4">
            <textarea
               {...register('description', { required: 'Description is required' })}
               className="textarea textarea-bordered w-full max-w-4xl"
               placeholder="Short Description"
               minLength={10}
               rows={3}
            />
         </div>
         {/*<CKEditor*/}
         {/*   editor={ClassicEditor}*/}
         {/*   data={props.description}*/}
         {/*   config={{*/}
         {/*      extraPlugins: [uploadPlugin],*/}
         {/*      fontFamily: {*/}
         {/*         options: ['default', 'Ubuntu, Arial, sans-serif', 'Ubuntu Mono, Courier New, Courier, monospace'],*/}
         {/*      },*/}
         {/*   }}*/}
         {/*   onReady={(editor) => {*/}
         {/*      // You can store the "editor" and use when it is needed.*/}
         {/*      console.log('Editor is ready to use!', editor);*/}
         {/*   }}*/}
         {/*   onChange={(event, editor) => {*/}
         {/*      const data = editor.getData();*/}
         {/*      props.setDescription(data);*/}
         {/*   }}*/}
         {/*   onBlur={(event, editor) => {*/}
         {/*      console.log('Blur.', editor);*/}
         {/*   }}*/}
         {/*   onFocus={(event, editor) => {*/}
         {/*      console.log('Focus.', editor);*/}
         {/*   }}*/}
         {/*/>*/}
      </div>
   );
}

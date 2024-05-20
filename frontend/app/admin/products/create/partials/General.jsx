'use client';

// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import uploadPlugin from '../../../../plugins/CustomUploadPlugin';

export default function General(props) {
   return (
      <div className="space-y-4">
         <div>
            <input
               className="input input-bordered w-full max-w-lg"
               type="text"
               placeholder="Name"
               onChange={(e) => props.setName(e.target.value)}
               value={props.name}
            />
         </div>
         <div className="space-x-4">
            <input
               className="input input-bordered w-full max-w-xs"
               type="text"
               placeholder="Model"
               onChange={(e) => props.setModel(e.target.value)}
               value={props.model}
            />
         </div>
         <div>
            <input
               type="number"
               min={1}
               placeholder="Price"
               className="input input-bordered w-full max-w-xs"
               onChange={(e) => props.setPrice(e.target.value)}
               value={props.price}
            />
         </div>
         <div className="flex space-x-4">
            <select
               className="select select-bordered w-full max-w-xs"
               onChange={(e) => props.setBrand(e.target.value)}
               value={props.brand}
            >
               <option value="">- Select Brand -</option>
               {props.brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                     {brand.name}
                  </option>
               ))}
            </select>
            <select
               className="select select-bordered w-full max-w-xs"
               onChange={(e) => props.setCategory(e.target.value)}
               value={props.category}
            >
               <option value="">- Select Category -</option>
               {props.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                     {category.name}
                  </option>
               ))}
            </select>
            <select
               className="select select-bordered w-full max-w-xs"
               onChange={(e) => props.setCollection(e.target.value)}
               value={props.collection}
            >
               <option value="">- Select Collection -</option>
               {props.collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                     {collection.name}
                  </option>
               ))}
            </select>
         </div>
         <div className="space-x-4">
            <textarea
               className="textarea textarea-bordered w-full max-w-4xl"
               placeholder="Short Description"
               minLength={10}
               value={props.shortDescription}
               onChange={(e) => props.setShortDescription(e.target.value)}
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

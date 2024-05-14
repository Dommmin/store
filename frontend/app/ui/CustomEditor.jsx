import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import axios from '../lib/axios';

function uploadAdapter(loader) {
   return {
      upload: () => {
         return new Promise(async (resolve, reject) => {
            try {
               const file = await loader.file;
               const formData = new FormData();
               formData.append('upload', file);
               const response = await axios.post('/api/v1/admin/images', formData, {
                  headers: {
                     'Content-Type': 'multipart/form-data',
                  },
               });
               console.log(response);
               resolve({
                  default: response.data,
               });
            } catch (error) {
               reject('Hello');
            }
         });
      },
      abort: () => {},
   };
}
function uploadPlugin(editor) {
   editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
   };
}

const editorConfiguration = {
   extraPlugins: [uploadPlugin],
   toolbar: [
      'heading',
      '|',
      'bold',
      'italic',
      'link',
      'bulletedList',
      'numberedList',
      '|',
      'outdent',
      'indent',
      '|',
      'imageUpload',
      'blockQuote',
      'insertTable',
      'mediaEmbed',
      'undo',
      'redo',
   ],
};

function CustomEditor(props) {
   return (
      <CKEditor
         editor={Editor}
         config={editorConfiguration}
         data={props.initialData}
         onChange={(event, editor) => {
            const data = editor.getData();
            console.log({ event, editor, data });
         }}
         onReady={(editor) => {
            // Add any additional setup code here
         }}
         onError={(error) => {
            console.error('CKEditor error:', error);
         }}
      />
   );
}

export default CustomEditor;

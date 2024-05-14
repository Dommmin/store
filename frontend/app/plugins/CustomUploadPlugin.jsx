import uploadAdapter from '../plugins/CustomUploadAdapter';

export default function uploadPlugin(editor) {
   editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
   };
}

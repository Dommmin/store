import axios from '../lib/axios';

export default function uploadAdapter(loader) {
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

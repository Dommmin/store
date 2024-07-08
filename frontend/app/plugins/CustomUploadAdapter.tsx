'use client';

import axios from '../lib/axios';

export default function uploadAdapter(loader) {
   return {
      upload: () => {
         return new Promise((resolve, reject) => {
            const file = loader.file;
            const formData = new FormData();
            formData.append('upload', file);
            axios
               .post('/api/v1/admin/images', formData, {
                  headers: {
                     'Content-Type': 'multipart/form-data',
                  },
               })
               .then((response) => {
                  resolve({
                     default: response.data.url,
                  });
               })
               .catch(() => {
                  reject('Hello');
               });
         });
      },
   };
}

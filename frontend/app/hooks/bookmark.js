import axios from '../lib/axios.js';
import useSWR from 'swr';

export const useBookmark = () => {
   const { data: countBookmarks, mutate: mutateBookmarks } = useSWR(
      '/api/v1/bookmarks/count',
      () => axios.get('/api/v1/bookmarks/count').then((res) => res.data),
      { refreshInterval: 0 },
   );

   return { countBookmarks, mutateBookmarks };
};

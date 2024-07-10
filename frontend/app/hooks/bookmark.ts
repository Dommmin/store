import axios from '../lib/axios';
import { useQuery } from '@tanstack/react-query';

export const useBookmark = () => {
   const fetchBookmarksCount = async () => {
      const response = await axios.get('/api/v1/bookmarks/count');
      return response.data;
   };

   const { data: countBookmarks, refetch: refetchBookmarksCount } = useQuery({
      queryKey: ['countBookmarks'],
      queryFn: fetchBookmarksCount,
   });

   return { countBookmarks, refetchBookmarksCount };
};

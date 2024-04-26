'use client';

import React, { useEffect, useState } from 'react';
import { MeiliSearch } from 'meilisearch';
import { useDebounce } from 'use-debounce';
import Image from 'next/image';
import Wrapper from '../ui/Wrapper';

const client = new MeiliSearch({
   host: 'http://127.0.0.1:7700/',
   apiKey: 'masterKey',
});

const index = client.index('posts');

export default function Home() {
   const [searchQuery, setSearchQuery] = useState('');
   const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
   const [posts, setPosts] = useState([]);
   const [isLoading, setIsLoading] = useState(true);

   const fetchPosts = () => {
      index
         .search(debouncedSearchQuery)
         .then((response) => {
            setPosts(response.hits);
         })
         .catch((error) => {
            console.error('Error:', error);
         })
         .finally(() => setIsLoading(false));
   };

   useEffect(() => {
      fetchPosts();
   }, [debouncedSearchQuery]);

   // const {
   //   data,
   //   fetchNextPage,
   //   hasNextPage,
   //   isFetchingNextPage,
   //   isError,
   //   error,
   // } = useInfiniteQuery({
   //   queryKey: ['posts', debouncedSearchQuery],
   //   queryFn: fetchPosts,
   //   getNextPageParam: (lastPage, pages) => pages.length,
   // });

   // const intObserver = useRef();
   // const lastNodeRef = useCallback(
   //     (node) => {
   //       if (intObserver.current) {
   //         intObserver.current.disconnect();
   //       }
   //
   //       intObserver.current = new IntersectionObserver((entries) => {
   //         if (entries[0].isIntersecting && hasNextPage) {
   //           fetchNextPage();
   //         }
   //       });
   //
   //       if (node) {
   //         intObserver.current.observe(node);
   //       }
   //     },
   //     [hasNextPage, fetchNextPage],
   // );
   //
   // if (isError) {
   //   return <div>Error: {error.message}</div>;
   // }

   // const posts = data?.pages.flat().map(page => page.hits).flat();

   if (isLoading) {
      return;
   }

   return (
      <Wrapper>
         <div className="mb-4">
            <label className="input input-bordered flex items-center gap-2 bg-base-content/30">
               <input
                  type="text"
                  className="grow"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
               />
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70"
               >
                  <path
                     fillRule="evenodd"
                     d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                     clipRule="evenodd"
                  />
               </svg>
            </label>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {posts?.map((post, index) => (
               <div key={index} className="card bordered shadow bg-base-content/30">
                  <figure>
                     <Image src={post.image} alt={post.title} width={640} height={480} priority={true} />
                  </figure>
                  <div className="card-body">
                     <h2 className="card-title">{post.title}</h2>
                     <p>{post.body}</p>
                  </div>
               </div>
            ))}
            {!posts?.length && <p>No posts found</p>}
         </div>
      </Wrapper>
   );
}

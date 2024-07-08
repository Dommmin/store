import { BookmarkIcon } from '@heroicons/react/24/outline';
import { useBookmark } from '../hooks/bookmark';
import Link from 'next/link';

export default function Bookmark() {
   const { countBookmarks } = useBookmark();

   return (
      <button className="flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white">
         <Link
            href={'/bookmarks'}
            className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white"
         >
            <BookmarkIcon className="h-5 w-5" />

            {countBookmarks ? (
               <div className="absolute right-0 top-0 -mr-2 -mt-2 h-4 w-4 rounded bg-error/70 text-[11px] font-medium text-white">
                  {countBookmarks}
               </div>
            ) : null}
         </Link>
      </button>
   );
}

'use client';

import LoadingSpinner from '../ui/LoadingSpinner';
import axios from '../lib/axios';
import Product from '../ui/Product';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Link from 'next/link';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import ServerError from '../ui/ServerError';

export default function Home() {
   const fetchCollections = async () => {
      const response = await axios.get('/api/v1/collections');

      return response.data;
   };

   const {
      data: collections,
      isPending,
      isError,
   } = useQuery({
      queryKey: ['collections'],
      queryFn: fetchCollections,
      retry: false,
      placeholderData: keepPreviousData,
   });

   if (isPending) return <LoadingSpinner className="h-screen" />;
   if (isError) return <ServerError />;
   if (collections.length <= 0)
      return <p className="flex h-screen items-center justify-center">No collections found...</p>;

   return (
      <>
         <div className="space-y-8">
            {collections.map((collection, index) => (
               <div key={collection.id} className="space-y-4">
                  <Link href={'/c/' + collection.slug} className={'block'}>
                     <div className={`rounded-md p-4 text-center ${index % 2 === 0 ? 'bg-info/50' : 'bg-accent/50'}`}>
                        <p className="text-7xl">{collection.name}</p>
                     </div>
                  </Link>

                  <Carousel
                     additionalTransfrom={0}
                     arrows
                     autoPlaySpeed={3000}
                     centerMode
                     className=""
                     containerClass="container mx-auto"
                     dotListClass=""
                     draggable
                     focusOnSelect={false}
                     infinite
                     itemClass=""
                     keyBoardControl
                     minimumTouchDrag={80}
                     pauseOnHover
                     renderArrowsWhenDisabled={false}
                     renderButtonGroupOutside={false}
                     renderDotsOutside={false}
                     responsive={{
                        bigDesktop: {
                           breakpoint: {
                              max: 3000,
                              min: 1920,
                           },
                           items: 4,
                           partialVisibilityGutter: 40,
                        },
                        desktop: {
                           breakpoint: {
                              max: 1920,
                              min: 1024,
                           },
                           items: 3,
                           partialVisibilityGutter: 40,
                        },
                        mobile: {
                           breakpoint: {
                              max: 640,
                              min: 0,
                           },
                           items: 1,
                           partialVisibilityGutter: 30,
                        },
                        tablet: {
                           breakpoint: {
                              max: 1024,
                              min: 640,
                           },
                           items: 2,
                           partialVisibilityGutter: 30,
                        },
                     }}
                     rewind={false}
                     rewindWithAnimation={false}
                     rtl={false}
                     shouldResetAutoplay
                     showDots={false}
                     sliderClass=""
                     slidesToSlide={1}
                     swipeable
                  >
                     {collection.products.map((product) => (
                        <div key={product.id} className="p-2">
                           <Link href={`/p/${product.url}`}>
                              <Product product={product} />
                           </Link>
                        </div>
                     ))}
                  </Carousel>
               </div>
            ))}
         </div>
      </>
   );
}

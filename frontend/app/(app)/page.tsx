'use client';

import { useEffect, useState } from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';
import axios from '../lib/axios';
import Product from '../ui/Product';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Link from 'next/link';

export default function Home() {
   const [collections, setCollections] = useState([]);
   const [isLoading, setIsLoading] = useState(true);

   const fetchCollections = () => {
      axios
         .get('/api/v1/collections')
         .then((response) => {
            setCollections(response.data);
         })
         .catch((error) => {
            console.error(error);
         })
         .finally(() => setIsLoading(false));
   };

   useEffect(() => {
      fetchCollections();
   }, []);

   if (isLoading) return <LoadingSpinner className="h-screen" />;

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

'use client';

import Wrapper from '../../../ui/Wrapper';
import { motion } from 'framer-motion';
import axios from '../../../lib/axios';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useCart } from '../../../hooks/cart';
import Link from 'next/link';
import { BookmarkIcon, PlusIcon, StarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../../hooks/auth';
import { useRouter } from 'next/navigation';
import { useBookmark } from '../../../hooks/bookmark';
import RatingStats from '../../../ui/RatingStats';
import SecondaryButton from '../../../ui/SecondaryButton';
import SuccessButton from '../../../ui/SuccessButton';
import Modal from '../../../ui/Modal';
import StarRating from '../../../ui/StarRating';
import Review from '../../../ui/Review';
import { useQuery } from '@tanstack/react-query';
import MainImageSkeleton from '../../../ui/MainImageSkeleton';
import LoadingSpinner from '../../../ui/LoadingSpinner';
import { Association, Product } from '../../../types/product';

const Page: React.FC<{ params: { url: string } }> = ({ params }) => {
   const productUrl = params.url;
   const [isOpen, setIsOpen] = useState(false);
   const [file, setFile] = useState(null);
   const [filePreview, setFilePreview] = useState('');
   const [rate, setRate] = useState(null);
   const [title, setTitle] = useState('');
   const [body, setBody] = useState('');

   const [reviewUrl, setReviewUrl] = useState('/api/v1/products/' + productUrl + '/reviews');

   const [size, setSize] = useState<number | string>('');
   const [selectedImage, setSelectedImage] = useState('');

   const { handleAddToCart } = useCart();
   const { refetchBookmarksCount } = useBookmark();
   const { user } = useAuth();
   const router = useRouter();

   const url = `/api/v1/products/${productUrl}`;

   const fetchProduct = async () => {
      const response = await axios.get(url);

      return response.data.data as Product;
   };

   const fetchReviews = async () => {
      const response = await axios.get(reviewUrl);

      return response.data;
   };

   const fetchRatings = async () => {
      const response = await axios.get(`/api/v1/products/${productUrl}/ratings`);

      return response.data;
   };

   const {
      data: product,
      refetch: refetchProduct,
      isPending,
   } = useQuery({
      queryKey: ['product'],
      queryFn: fetchProduct,
   });

   const {
      data: reviews,
      refetch: refetchReviews,
      isPending: isPendingReviews,
   } = useQuery({
      queryKey: ['reviews'],
      queryFn: fetchReviews,
   });

   const {
      data: ratings,
      refetch: refetchRatings,
      isPending: isPendingRatings,
   } = useQuery({
      queryKey: ['ratings'],
      queryFn: fetchRatings,
   });

   const disableAddToCart = () => {
      return !product.sizes.length || !size;
   };

   const handleMarkAsBookmark = () => {
      if (!user) {
         router.push('/login');
      }

      axios
         .post('/api/v1/bookmarks', { product_id: product.id })
         .then(async () => {
            refetchProduct();
            refetchBookmarksCount();
         })
         .catch((error) => {
            console.error('Error:', error);
         });
   };

   const handleDeleteBookmark = async () => {
      try {
         const response = await axios.delete('/api/v1/bookmarks/' + product.bookmark_id);

         if (response.status === 200) {
            refetchProduct();
            refetchBookmarksCount();
         }
      } catch (error) {
         console.error('Error:', error);
      }
   };

   const handleRate = (rating: number) => {
      setRate(rating);
   };

   const handleRemoveFile = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      setFile(null);
      setFilePreview('');
   };

   const handleSubmitReview = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData();
      formData.append('product_id', product.id as string);
      formData.append('rating', rate);
      formData.append('title', title);
      formData.append('body', body);

      if (file) {
         formData.append('image', file);
      }

      try {
         const response = await axios.post('/api/v1/products/' + productUrl + '/reviews', formData);

         if (response.status === 201) {
            clearForm();
            await refetchReviews();
            await refetchRatings();
            await refetchProduct();
         }
      } catch (error) {
         console.error('Error:', error);
      }
   };

   const clearForm = () => {
      setRate(0);
      setTitle('');
      setBody('');
      setFile(null);
      setFilePreview('');
   };

   useEffect(() => {
      const reader = new FileReader();
      reader.onloadend = () => {
         setFilePreview(reader.result as string);
      };
      if (file) {
         reader.readAsDataURL(file);
      }
   }, [file]);

   useEffect(() => {
      refetchProduct();
   }, [productUrl, refetchProduct]);

   const variants = {
      hidden: { opacity: 0 },
      show: {
         opacity: 1,
         transition: {
            staggerChildren: 0.1,
         },
      },
   };

   useEffect(() => {
      if (product) {
         setSelectedImage(product.main_image);
      }
   }, [product]);

   if (isPending || isPendingReviews || isPendingRatings) return <LoadingSpinner className="h-screen" />;

   return (
      <Wrapper>
         <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            <div className="relative lg:col-span-2">
               <button className="absolute right-2 top-2">
                  {product?.bookmark_id ? (
                     <BookmarkIcon
                        onClick={handleDeleteBookmark}
                        className="h-10 w-10 text-warning hover:text-warning/80"
                        fill="currentColor"
                     />
                  ) : (
                     <BookmarkIcon
                        onClick={handleMarkAsBookmark}
                        className="h-10 w-10 text-warning hover:text-warning/80"
                     />
                  )}
               </button>
               {selectedImage ? (
                  <Image
                     src={selectedImage}
                     alt={product.name}
                     width={600}
                     height={600}
                     blurDataURL={selectedImage}
                     placeholder="blur"
                     className="rounded-lg"
                  />
               ) : (
                  <MainImageSkeleton />
               )}

               <div className="mt-4 grid grid-cols-5 gap-4">
                  {product.images.map((image) => (
                     <Image
                        key={image.url}
                        src={image.url}
                        alt={product.name}
                        width={200}
                        height={200}
                        blurDataURL={image.url}
                        placeholder="blur"
                        onClick={() => setSelectedImage(image.url)}
                        className={
                           'h-12 w-full cursor-pointer rounded-lg object-cover sm:h-24 ' +
                           (selectedImage === image.url ? 'border-2 border-info' : '')
                        }
                     />
                  ))}
               </div>
            </div>
            <div className="lg:col-span-1">
               <h1 className="text-3xl font-bold">{product.name}</h1>
               <div className="mt-2 flex items-center justify-start">
                  <span className="rounded-3xl bg-info/80 px-4 py-2">{product.formatted_price} PLN</span>
               </div>

               <div className="mb-8 mt-8 border-t border-gray-400" />

               {product.sizes.length > 0 && (
                  <div className="mb-8">
                     SIZE
                     <select
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        className="select select-info mt-2 w-full text-lg"
                     >
                        <option value="" disabled>
                           Select Size
                        </option>
                        {product.sizes.map((size) => (
                           <option key={size.id} value={size.id} disabled={!size.stock}>
                              {size.value}
                           </option>
                        ))}
                     </select>
                  </div>
               )}
               <div className="mb-8">{product.short_description}</div>
               <button
                  onClick={() => handleAddToCart(product.id, size)}
                  className="btn btn-info w-full text-white"
                  // disabled={() => disableAddToCart}
               >
                  Add to Cart
               </button>
            </div>
            {Object.entries(product.associations).length > 0 && (
               <div>
                  <p className="text-xl font-bold">Variants</p>
                  {Object.entries(product.associations).map(([key, associations]) => (
                     <div key={key}>
                        <div className="py-2 font-bold">
                           {key}: {product.attributes.find((attribute) => attribute.name === key)?.value}
                        </div>
                        <div className="flex space-x-2">
                           {associations.map((item: Association) => (
                              <div key={item.id}>
                                 <Link href={`/p/${item.variant.url}`} prefetch={true}>
                                    <Image
                                       className="rounded-lg"
                                       width={100}
                                       height={100}
                                       src={item.variant.image.url}
                                       alt={item.variant.name}
                                    />
                                 </Link>
                                 <p>{item.variant.attributes.find((attribute) => attribute.name === key)?.value}</p>
                              </div>
                           ))}
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>
         {product.attributes.length > 0 && (
            <div className="mt-8">
               <p className="text-xl font-bold">Additional information</p>
               <div className="mt-4 flex justify-center overflow-x-auto overflow-y-hidden rounded-b-box">
                  <table className="table table-zebra">
                     <tbody>
                        {product.attributes.map((attribute, index) => (
                           <tr className="odd:bg-info/10" key={index}>
                              <td>
                                 <span
                                    className="tracking-widest underline decoration-dotted underline-offset-4"
                                    title={attribute.description}
                                 >
                                    {attribute.name}
                                 </span>
                              </td>
                              <td className="tracking-wide">{attribute.value}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         )}
         <div className="mt-8">
            <p className="text-xl font-bold">Description</p>
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
         </div>

         {reviews.data.length > 0 ? (
            <div className="mt-8">
               <p className="text-xl font-bold">Ratings</p>
               <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  <RatingStats
                     ratings={ratings}
                     ratingsCount={product.reviews_count}
                     averageRating={product.reviews_avg_rating}
                     className="col-span-2"
                  />
                  {!product.review ? (
                     <div className="col-span-1 flex items-center justify-center">
                        <button
                           className="btn btn-accent btn-wide w-full text-white lg:max-w-xs"
                           onClick={() => setIsOpen(true)}
                        >
                           Post review
                        </button>
                     </div>
                  ) : (
                     <div className="col-span-1 flex items-center justify-center">
                        <div className="flex space-x-2 text-center lg:flex-col">
                           <p className="text-2xl">Your rating:</p>
                           <div className="flex">
                              {Array.from({ length: 5 }, (_, i) => (
                                 <StarIcon
                                    key={i}
                                    className="h-6"
                                    color={i < product.review.rating ? '#fcc419' : 'gray'}
                                    fill={i < product.review.rating ? '#fcc419' : 'gray'}
                                 />
                              ))}
                           </div>
                        </div>
                     </div>
                  )}
               </div>
               <div className="mt-8">
                  <p className="text-xl font-bold">Ratings</p>
                  <motion.div className="mt-4 space-y-4" variants={variants} initial="hidden" animate="show">
                     {reviews.data.map((review) => (
                        <Review key={review.id} review={review} />
                     ))}
                     {(reviews.links.prev || reviews.links.next) && (
                        <div className="join flex justify-center">
                           <button
                              disabled={!reviews.links.prev}
                              onClick={() => setReviewUrl(reviews.links.prev)}
                              className="btn join-item"
                           >
                              «
                           </button>
                           <button className="btn join-item">Page {reviews.meta.current_page}</button>
                           <button
                              disabled={!reviews.links.next}
                              onClick={() => setReviewUrl(reviews.links.next)}
                              className="btn join-item"
                           >
                              »
                           </button>
                        </div>
                     )}
                  </motion.div>
               </div>
            </div>
         ) : (
            <div className="mt-8 space-y-2 text-center">
               <p className="text-xl tracking-widest">No reviews yet...</p>
               <button
                  className="btn btn-accent btn-wide w-full text-white lg:max-w-xs"
                  onClick={() => setIsOpen(true)}
               >
                  Post review
               </button>
            </div>
         )}
         <Modal show={isOpen} onClose={() => setIsOpen(false)}>
            <form onSubmit={handleSubmitReview} className="p-6">
               <div className="mt-6">
                  <label className="form-control w-full">
                     <div className="label">
                        <span className="label-text">Title</span>
                     </div>
                     <input
                        type="text"
                        className="input input-bordered w-full"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                     />
                  </label>
               </div>

               <div className="mt-6">
                  <label className="form-control">
                     <div className="label">
                        <span className="label-text">What do you think about this product?</span>
                     </div>
                     <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="textarea textarea-bordered h-24"
                     />
                  </label>

                  {/*<InputError messages={errors.password} className="mt-2" />*/}
               </div>

               <div className="mt-6 flex space-x-4">
                  {!filePreview ? (
                     <div>
                        <label
                           htmlFor="image"
                           className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-base-100 font-medium text-gray-500 dark:border-gray-600 dark:text-gray-300 dark:placeholder-gray-400"
                        >
                           <PlusIcon className="h-6 w-6" />
                        </label>
                        <input
                           type="file"
                           accept="image/*"
                           name="image"
                           id="image"
                           className="sr-only"
                           onChange={(e) => setFile(e.target.files[0])}
                        />
                     </div>
                  ) : (
                     <div className="relative px-1 py-4">
                        <div className="absolute z-40 -mt-3 ml-[55px]">
                           <button
                              type="button"
                              className="ease flex h-6 w-6 items-center justify-center rounded-full bg-base-300 transition-all duration-200 active:scale-95"
                              onClick={(event) => handleRemoveFile(event)}
                           >
                              <XMarkIcon className="hover:text-accent-3 mx-[1px] h-3 w-3 text-white" />
                           </button>
                        </div>
                        <Image
                           src={filePreview}
                           alt={product.name}
                           width={64}
                           height={64}
                           className="h-16 w-16 rounded-lg"
                        />
                     </div>
                  )}

                  <div className="flex items-center space-x-2">
                     <p>Include image</p>
                     <p className="label-text">(optional)</p>
                  </div>
               </div>

               <div className="mt-4 flex justify-center">
                  <div className="flex flex-col justify-center text-center">
                     <StarRating maxRating={5} size={40} onSetRating={handleRate} />
                  </div>
               </div>

               <div className="mt-6 flex justify-end">
                  <SecondaryButton type="button" onClick={() => setIsOpen(false)}>
                     Cancel
                  </SecondaryButton>

                  <SuccessButton className="ms-3">Submit</SuccessButton>
               </div>
            </form>
         </Modal>
      </Wrapper>
   );
};

export default Page;

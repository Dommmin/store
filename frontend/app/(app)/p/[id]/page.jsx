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
import useSWR from 'swr';
import { useBookmark } from '../../../hooks/bookmark';
import RatingStats from '../../../ui/RatingStats';
import InputError from '../../../ui/InputError';
import SecondaryButton from '../../../ui/SecondaryButton';
import SuccessButton from '../../../ui/SuccessButton';
import Modal from '../../../ui/Modal';
import StarRating from '../../../ui/StarRating';
import Review from '../../../ui/Review';

export default function Page({ params }) {
   const productId = params.id;
   const [isOpen, setIsOpen] = useState(false);
   const [file, setFile] = useState(null);
   const [filePreview, setFilePreview] = useState('');
   const [rate, setRate] = useState(0);
   const [title, setTitle] = useState('');
   const [body, setBody] = useState('');

   const [reviews, setReviews] = useState([]);
   const [ratings, setRatings] = useState([]);
   const [isFetchingReviews, setIsFetchingReviews] = useState(true);
   const [isFetchingRatings, setIsFetchingRatings] = useState(true);
   const [reviewUrl, setReviewUrl] = useState('/api/v1/products/' + productId + '/reviews');

   const [size, setSize] = useState('');
   const [selectedImage, setSelectedImage] = useState('');

   const { handleAddToCart } = useCart();
   const { mutateBookmarks } = useBookmark();
   const { user } = useAuth();
   const router = useRouter();

   const url = `/api/v1/products/${productId}`;

   const fetchProduct = async () => {
      const response = await axios.get(url);

      if (!selectedImage) {
         setSelectedImage(response.data.data.main_image);
      }

      return response.data.data;
   };

   const fetchReviews = () => {
      axios
         .get(reviewUrl)
         .then((response) => {
            setReviews(response.data);
         })
         .catch((error) => {
            console.error('Error:', error);
         })
         .finally(() => setIsFetchingReviews(false));
   };

   const fetchRatings = () => {
      axios
         .get(`/api/v1/products/${productId}/ratings`)
         .then((response) => {
            setRatings(response.data);
         })
         .catch((error) => {
            console.error('Error:', error);
         })
         .finally(() => setIsFetchingRatings(false));
   };

   const { data: product, mutate, isLoading } = useSWR(url, () => fetchProduct());

   const disableAddToCart = () => {
      return !product.sizes.length || !size;
   };

   const handleMarkAsBookmark = (event) => {
      event.preventDefault();

      if (!user) {
         router.push('/login');
      }

      axios
         .post('/api/v1/bookmarks', { product_id: product.id })
         .then(async () => {
            await mutateBookmarks();
            await mutate();
         })
         .catch((error) => {
            console.error('Error:', error);
         });
   };

   const handleDeleteBookmark = (event) => {
      event.preventDefault();

      axios
         .delete('/api/v1/bookmarks/' + product.bookmark_id)
         .then(async () => {
            await mutateBookmarks();
            await mutate();
         })
         .catch((error) => {
            console.error('Error:', error);
         });
   };

   const handleRate = (rating) => {
      setRate(rating);
   };

   const handleRemoveFile = (event) => {
      event.preventDefault();

      setFile(null);
      setFilePreview('');
   };

   const handleSubmitReview = (event) => {
      event.preventDefault();

      const formData = new FormData();
      formData.append('product_id', product.id);
      formData.append('rating', rate);
      formData.append('title', title);
      formData.append('body', body);

      if (file) {
         formData.append('image', file);
      }

      axios
         .post('/api/v1/products/' + productId + '/reviews', formData)
         .then(() => {
            setIsOpen(false);
            clearForm();
            fetchReviews();
            fetchRatings();
            mutate();
         })
         .catch((error) => {
            console.error('Error:', error);
         });
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
         setFilePreview(reader.result);
      };
      if (file) {
         reader.readAsDataURL(file);
      }
   }, [file]);

   useEffect(() => {
      fetchRatings();
   }, []);

   useEffect(() => {
      fetchReviews();
   }, [reviewUrl]);

   useEffect(() => {
      mutate();
   }, [productId, mutate]);

   const variants = {
      hidden: { opacity: 0 },
      show: {
         opacity: 1,
         transition: {
            staggerChildren: 0.1,
         },
      },
   };

   if (isLoading || isFetchingReviews || isFetchingRatings) return;

   console.log(product.associations);

   return (
      <Wrapper>
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="relative lg:col-span-2">
               <button className="absolute top-2 right-2">
                  {product?.bookmark_id ? (
                     <BookmarkIcon
                        onClick={(event) => handleDeleteBookmark(event)}
                        className="h-10 w-10 text-warning hover:text-warning/80"
                        fill="currentColor"
                     />
                  ) : (
                     <BookmarkIcon
                        onClick={(event) => handleMarkAsBookmark(event)}
                        className="h-10 w-10 text-warning hover:text-warning/80"
                     />
                  )}
               </button>
               <Image
                  src={selectedImage}
                  alt={product.name}
                  layout="responsive"
                  width={200}
                  height={200}
                  className="rounded-lg"
               />

               <div className="grid grid-cols-5 gap-4 mt-4">
                  {product.images.map((image) => (
                     <Image
                        key={image.url}
                        src={image.url}
                        alt={product.name}
                        width={200}
                        height={200}
                        onClick={() => setSelectedImage(image.url)}
                        className={
                           'w-full h-12 sm:h-24 object-cover cursor-pointer rounded-lg ' +
                           (selectedImage === image.url ? 'border-2 border-info' : '')
                        }
                     />
                  ))}
               </div>
            </div>
            <div className="lg:col-span-1">
               <h1 className="text-3xl font-bold">{product.name}</h1>
               <div className="flex items-center justify-start mt-2">
                  <span className="px-4 py-2 bg-info/80 rounded-3xl">{product.formatted_price} PLN</span>
               </div>

               <div className="border-t border-gray-400 mt-8 mb-8"></div>

               {product.sizes.length > 0 && (
                  <div className="mb-8">
                     SIZE
                     <select
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        className="select select-info w-full text-lg mt-2"
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
                  <p className="font-bold text-xl">Variants</p>
                  {Object.entries(product.associations).map(([key, value]) => (
                     <div key={key}>
                        <div className="font-bold py-2">
                           {key}: {product.attributes.find((attribute) => attribute.name === key)?.value}
                        </div>
                        <div className="flex space-x-2">
                           {value.map((item) => (
                              <div key={item.id}>
                                 <Link href={`/p/${item.variant.id}`} prefetch={true}>
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
               <p className="font-bold text-xl">Additional information</p>
               <div className="flex justify-center overflow-x-auto overflow-y-hidden mt-4 rounded-b-box">
                  <table className="table table-zebra">
                     <tbody>
                        {product.attributes.map((attribute, index) => (
                           <tr className="odd:bg-info/10" key={index}>
                              <td>
                                 <span
                                    className="underline decoration-dotted underline-offset-4 tracking-widest"
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
            <p className="font-bold text-xl">Description</p>
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
         </div>

         {reviews.data.length > 0 ? (
            <div className="mt-8">
               <p className="font-bold text-xl">Ratings</p>
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <RatingStats
                     ratings={ratings}
                     ratingsCount={product.reviews_count}
                     averageRating={product.reviews_avg_rating}
                     className="col-span-2"
                  />
                  {!product.review ? (
                     <div className="flex justify-center items-center col-span-1">
                        <button
                           className="btn btn-accent btn-wide w-full lg:max-w-xs text-white"
                           onClick={() => setIsOpen(true)}
                        >
                           Post review
                        </button>
                     </div>
                  ) : (
                     <div className="flex justify-center items-center col-span-1">
                        <div className="flex space-x-2 lg:flex-col text-center">
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
                  <p className="font-bold text-xl">Ratings</p>
                  <motion.div className="mt-4 space-y-4" variants={variants} initial="hidden" animate="show">
                     {reviews.data.map((review) => (
                        <Review key={review.id} review={review} />
                     ))}
                     {(reviews.links.prev || reviews.links.next) && (
                        <div className="flex justify-center join">
                           <button
                              disabled={!reviews.links.prev}
                              onClick={() => setReviewUrl(reviews.links.prev)}
                              className="join-item btn"
                           >
                              «
                           </button>
                           <button className="join-item btn">Page {reviews.meta.current_page}</button>
                           <button
                              disabled={!reviews.links.next}
                              onClick={() => setReviewUrl(reviews.links.next)}
                              className="join-item btn"
                           >
                              »
                           </button>
                        </div>
                     )}
                  </motion.div>
               </div>
            </div>
         ) : (
            <div className="mt-8 text-center space-y-2">
               <p className="tracking-widest text-xl">No reviews yet...</p>
               <button
                  className="btn btn-accent btn-wide w-full lg:max-w-xs text-white"
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

               <div className="flex mt-6 space-x-4">
                  {!filePreview ? (
                     <div>
                        <label
                           htmlFor="image"
                           className="flex items-center justify-center w-16 h-16 bg-base-100 border-2 border-dashed border-gray-200 text-gray-500 font-medium cursor-pointer rounded-lg dark:text-gray-300 dark:border-gray-600 dark:placeholder-gray-400"
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
                           className="w-16 h-16 rounded-lg"
                        />
                     </div>
                  )}

                  <div className="flex items-center space-x-2">
                     <p>Include image</p>
                     <p className="label-text">(optional)</p>
                  </div>
               </div>

               <div className="flex justify-center mt-4">
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
}

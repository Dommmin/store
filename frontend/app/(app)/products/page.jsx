'use client';

import React, { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import axios from '../../lib/axios';
import { AnimatePresence, motion } from 'framer-motion';
import Product from '../../ui/Product';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import Link from 'next/link';
import useSWR from 'swr';
import ProductSkeleton from '../../ui/ProductSkeleton';

export default function Page() {
   const [searchQuery, setSearchQuery] = useState('');
   const [value, setValue] = useState([1, 10000]);
   const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
   const [debouncedValue] = useDebounce(value, 1000);
   const [brands, setBrands] = useState([]);
   const [categories, setCategories] = useState([]);
   const [brand, setBrand] = useState('');
   const [category, setCategory] = useState('');
   const [sort, setSort] = useState(JSON.stringify({ column: 'id', order: 'asc' }));
   const [url, setUrl] = useState('/api/v1/products');

   const handleInputChange = (index, event) => {
      let newValue = Number(event.target.value);
      newValue = isNaN(newValue) ? 0 : newValue;
      newValue = Math.max(0, Math.min(10000, newValue));
      setValue((prevState) => {
         const newValues = [...prevState];
         newValues[index] = newValue;
         return newValues;
      });
   };

   const fetchCategories = () => {
      axios
         .get('/api/v1/categories')
         .then((response) => {
            setCategories(response.data);
         })
         .catch((error) => {
            console.error('Error:', error);
         });
   };

   const fetchBrands = () => {
      axios
         .get('/api/v1/brands')
         .then((response) => {
            setBrands(response.data);
         })
         .catch((error) => {
            console.error('Error:', error);
         });
   };

   const fetchProducts = async () => {
      const sortObject = JSON.parse(sort);

      const response = await axios.get(url, {
         params: {
            q: debouncedSearchQuery,
            brand: brand,
            category: category,
            min_price: value[0],
            max_price: value[1],
            orderBy: sortObject.column,
            order: sortObject.order,
         },
      });

      return response.data;
   };

   const { data, mutate, isLoading } = useSWR(url, () => fetchProducts());

   useEffect(() => {
      fetchBrands();
      fetchCategories();
   }, []);

   useEffect(() => {
      mutate();
   }, [debouncedSearchQuery, brand, category, debouncedValue, sort, url]);

   // if (isLoading) {
   //     return;
   // }

   return (
      <div className="grid grid-cols-1 2xl:grid-cols-8 gap-4 py-4 px-4 sm:px-6 lg:px-8">
         <div className="w-full hidden 2xl:block max-w-xs col-span-2">
            <div className="sticky top-4 border border-neutral-200 dark:border-neutral-700 p-4 bg-white dark:bg-base-300 rounded-lg">
               <h2 className="font-bold mb-4">Filters</h2>
               <div>
                  <label className="form-control w-full max-w-xs">
                     <div className="label">
                        <span className="label-text">Brand</span>
                     </div>
                     <select
                        className="select select-bordered"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                     >
                        <option value="">-- Filter by Brand --</option>
                        {brands?.map((brand) => (
                           <option key={brand.id} value={brand.id}>
                              {brand.name}
                           </option>
                        ))}
                     </select>
                  </label>
               </div>

               <div>
                  <label className="form-control w-full max-w-xs">
                     <div className="label">
                        <span className="label-text">Category</span>
                     </div>
                     <select
                        className="select select-bordered"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                     >
                        <option value="">-- Filter by Category --</option>
                        {categories?.map((category) => (
                           <option key={category.id} value={category.id}>
                              {category.name}
                           </option>
                        ))}
                     </select>
                  </label>
               </div>

               <div className="py-2">
                  <span className="label-text">Price Range</span>
                  <div className="flex space-x-2 mt-1 mb-4">
                     <input
                        min={0}
                        max={value[1]}
                        onChange={(e) => handleInputChange(0, e)}
                        value={value[0]}
                        type="text"
                        className="input input-bordered w-full max-w-xs"
                     />
                     <input
                        min={value[0]}
                        max={10000}
                        onChange={(e) => handleInputChange(1, e)}
                        value={value[1]}
                        type="text"
                        className="input input-bordered w-full max-w-xs"
                     />
                  </div>
                  <RangeSlider step={1} min={1} max={10000} value={value} onInput={setValue} />
               </div>
               <div className="mt-8 border border-natural-200 dark:border-neutral-700 rounded-lg p-4">
                  <span className="label-text">Sort by</span>
                  <div>
                     <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="select select-bordered w-full"
                     >
                        <option value={JSON.stringify({ column: 'id', order: 'asc' })}>Default</option>
                        <option value={JSON.stringify({ column: 'price', order: 'asc' })}>Price ASC</option>
                        <option value={JSON.stringify({ column: 'price', order: 'desc' })}>Price DESC</option>
                        <option value={JSON.stringify({ column: 'name', order: 'asc' })}>Name ASC</option>
                        <option value={JSON.stringify({ column: 'name', order: 'desc' })}>Name DESC</option>
                        <option value={JSON.stringify({ column: 'id', order: 'desc' })}>Latest</option>
                     </select>
                  </div>
               </div>
            </div>
         </div>

         <div className="w-full flex-grow col-span-4 max-2xl:mx-auto">
            <div className="mb-4">
               <label className="input input-bordered flex items-center w-full">
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

            {isLoading ? (
               <ProductSkeleton />
            ) : (
               <>
                  <motion.div
                     layout
                     className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 min-[1920px]:grid-cols-4 min-[3440px]:grid-cols-5 gap-4"
                  >
                     <AnimatePresence>
                        {data.data?.map((product) => (
                           <Link href={`/p/${product.url}`} key={product.id}>
                              <Product product={product} />
                           </Link>
                        ))}
                     </AnimatePresence>
                     {!data.data?.length && <p>No products found</p>}
                  </motion.div>
                  <div className="flex justify-center items-center mt-8 join">
                     <button
                        disabled={!data.prev_page_url}
                        onClick={() => setUrl(data.prev_page_url)}
                        className="join-item btn"
                     >
                        «
                     </button>
                     <button className="join-item btn btn-disabled">{data?.current_page} Page</button>
                     <button
                        disabled={!data.next_page_url}
                        onClick={() => setUrl(data.next_page_url)}
                        className="join-item btn"
                     >
                        »
                     </button>
                  </div>
               </>
            )}
         </div>
         <div className="hidden 2xl:col-span-2" />
      </div>
   );
}

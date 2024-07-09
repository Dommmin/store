'use client';

import React, { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import axios from '../../lib/axios';
import { AnimatePresence, motion } from 'framer-motion';
import Product from '../../ui/Product';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import Link from 'next/link';
import ProductSkeleton from '../../ui/ProductSkeleton';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import { Brand } from '../../types/brand';
import { Category } from '../../types/product';

export default function Page() {
   const router = useRouter();
   const searchParams = useSearchParams();

   const [searchQuery, setSearchQuery] = useState(searchParams.get('searchQuery') || '');
   const [value, setValue] = useState([
      Number(searchParams.get('min_price')) || 1,
      Number(searchParams.get('max_price')) || 10000,
   ]);
   const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
   const [debouncedValue] = useDebounce(value, 1000);
   const [brand, setBrand] = useState(searchParams.get('brand') || '');
   const [category, setCategory] = useState(searchParams.get('category') || '');
   const [sort, setSort] = useState(
      JSON.stringify({
         column: searchParams.get('orderBy') || 'id',
         order: searchParams.get('order') || 'asc',
      }),
   );
   const [url, setUrl] = useState('/api/v1/products');

   const updateUrl = () => {
      const query = {
         searchQuery: debouncedSearchQuery,
         min_price: debouncedValue[0].toString(),
         max_price: debouncedValue[1].toString(),
         brand: brand || '',
         category: category || '',
         orderBy: JSON.parse(sort).column,
         order: JSON.parse(sort).order,
      };

      const queryString = new URLSearchParams(query).toString();
      router.push(`/products?${queryString}`);
   };

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

   const fetchCategories = async () => {
      const response = await axios.get('/api/v1/categories');
      return response.data;
   };

   const fetchBrands = async () => {
      const response = await axios.get('/api/v1/brands');
      return response.data;
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

   const { data, refetch, isPending } = useQuery({
      queryKey: ['products'],
      queryFn: fetchProducts,
   });

   const { data: brands } = useQuery({
      queryKey: ['brands'],
      queryFn: fetchBrands,
   });

   const { data: categories } = useQuery({
      queryKey: ['categories'],
      queryFn: fetchCategories,
   });

   useEffect(() => {
      updateUrl();
      refetch();
   }, [debouncedSearchQuery, brand, category, debouncedValue, sort, url, updateUrl, refetch]);

   return (
      <div className="grid grid-cols-1 gap-4 px-4 py-4 sm:px-6 lg:px-8 2xl:grid-cols-8">
         <div className="col-span-2 hidden w-full max-w-xs 2xl:block">
            <div className="sticky top-4 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-base-300">
               <h2 className="mb-4 font-bold">Filters</h2>
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
                        {brands?.map((brand: Brand) => (
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
                        {categories?.map((category: Category) => (
                           <option key={category.id} value={category.id}>
                              {category.name}
                           </option>
                        ))}
                     </select>
                  </label>
               </div>

               <div className="py-2">
                  <span className="label-text">Price Range</span>
                  <div className="mb-4 mt-1 flex space-x-2">
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
               <div className="border-natural-200 mt-8 rounded-lg border p-4 dark:border-neutral-700">
                  <span className="label-text">Order By</span>
                  <div>
                     <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="select select-bordered w-full max-w-xs"
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

         <div className="col-span-4 w-full flex-grow max-2xl:mx-auto">
            <div className="mb-4">
               <label className="input input-bordered flex w-full items-center">
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
                     className="h-4 w-4 opacity-70"
                  >
                     <path
                        fillRule="evenodd"
                        d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                        clipRule="evenodd"
                     />
                  </svg>
               </label>
            </div>
            <div className="mb-5 rounded-lg border border-neutral-200 bg-white p-3 2xl:hidden dark:border-neutral-700 dark:bg-base-300">
               <h2 className="pb-8 font-bold">Filters</h2>
               <div className="flex flex-wrap">
                  <div className="flex flex-wrap md:flex-nowrap md:space-x-2">
                     <div className="flex space-x-2">
                        <label className="form-control w-full max-w-xs">
                           <div className="label">
                              <span className="label-text">Brand</span>
                           </div>
                           <select
                              className="select select-bordered"
                              value={brand}
                              onChange={(e) => setBrand(e.target.value)}
                           >
                              <option value="">All Brands</option>
                              {brands?.map((brand: Brand) => (
                                 <option key={brand.id} value={brand.id}>
                                    {brand.name}
                                 </option>
                              ))}
                           </select>
                        </label>
                        <label className="form-control w-full max-w-xs">
                           <div className="label">
                              <span className="label-text">Category</span>
                           </div>
                           <select
                              className="select select-bordered"
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                           >
                              <option value="">All Categories</option>
                              {categories?.map((category: Category) => (
                                 <option key={category.id} value={category.id}>
                                    {category.name}
                                 </option>
                              ))}
                           </select>
                        </label>
                     </div>

                     <label className="form-control w-full max-w-sm md:pr-2">
                        <div className="label">
                           <span className="label-text">Order By</span>
                        </div>
                        <select
                           value={sort}
                           onChange={(e) => setSort(e.target.value)}
                           className="select select-bordered w-full max-w-sm"
                        >
                           <option value={JSON.stringify({ column: 'id', order: 'asc' })}>Default</option>
                           <option value={JSON.stringify({ column: 'price', order: 'asc' })}>Price ASC</option>
                           <option value={JSON.stringify({ column: 'price', order: 'desc' })}>Price DESC</option>
                           <option value={JSON.stringify({ column: 'name', order: 'asc' })}>Name ASC</option>
                           <option value={JSON.stringify({ column: 'name', order: 'desc' })}>Name DESC</option>
                           <option value={JSON.stringify({ column: 'id', order: 'desc' })}>Latest</option>
                        </select>
                     </label>
                  </div>

                  <div className="w-full max-w-sm py-2">
                     <span className="label-text">Price Range</span>
                     <div className="mb-4 mt-1 flex space-x-2">
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
               </div>
            </div>

            {isPending ? (
               <ProductSkeleton />
            ) : (
               <>
                  <motion.div
                     layout
                     className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 min-[1920px]:grid-cols-4 min-[3440px]:grid-cols-5"
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
                  <div className="join mt-8 flex items-center justify-center">
                     <button
                        disabled={!data.prev_page_url}
                        onClick={() => setUrl(data.prev_page_url)}
                        className="btn join-item"
                     >
                        «
                     </button>
                     <button className="btn btn-disabled join-item">{data?.current_page} Page</button>
                     <button
                        disabled={!data.next_page_url}
                        onClick={() => setUrl(data.next_page_url)}
                        className="btn join-item"
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

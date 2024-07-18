'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Wrapper from '../../ui/Wrapper';
import axios from '../../lib/axios';
import Link from 'next/link';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Switch } from '@headlessui/react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Product } from '../../types/product';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Products() {
   const [url, setUrl] = useState('/api/v1/admin/products');
   const [selectedItems, setSelectedItems] = useState([]);
   const [sortBy, setSortBy] = useState('id');
   const [sortOrder, setSortOrder] = useState('desc');
   const [perPage, setPerPage] = useState(10);
   const [action, setAction] = useState('');

   const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
         setSelectedItems(data.data.map((item: Product) => item.id));
         return;
      }
      setSelectedItems([]);
   };

   const handleSelectOne = (id: number | string) => {
      if (selectedItems.includes(id)) {
         setSelectedItems(selectedItems.filter((item) => item !== id));
      } else {
         setSelectedItems([...selectedItems, id]);
      }
   };

   const handleSort = async (field: string) => {
      if (sortBy === field) {
         setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
         await refetchData();
      } else {
         setSortBy(field);
         setSortOrder('asc');
         await refetchData();
      }
   };

   const fetchData = useCallback(
      async (fetchUrl?: string) => {
         const response = await axios.get(fetchUrl || url, { params: { sortBy, sortOrder, perPage } });
         return response.data;
      },
      [url, sortBy, sortOrder, perPage],
   );

   const {
      data,
      isPending,
      refetch: refetchData,
      isError,
      error,
   } = useQuery({
      queryKey: ['products', url],
      queryFn: () => fetchData(),
      placeholderData: keepPreviousData,
   });

   const queryClient = useQueryClient();

   useEffect(() => {
      if (data && data.next_page_url) {
         queryClient.prefetchQuery({
            queryKey: ['products', data.next_page_url],
            queryFn: () => fetchData(data.next_page_url),
         });
      }
   }, [data, fetchData, queryClient]);

   const variants = {
      hidden: { opacity: 0 },
      show: {
         opacity: 1,
         transition: {
            staggerChildren: 0.1,
         },
      },
   };

   const childVariants = {
      hidden: { opacity: 0 },
      show: { opacity: 1 },
   };

   const handlePublish = async (item: Product) => {
      let action = 'publish';

      if (item.is_published) {
         action = 'unpublish';
      }

      try {
         const response = await axios.post(`/api/v1/admin/products/${item.url}/${action}`);

         if (response.status === 200) {
            await refetchData();
         }
      } catch (error) {
         console.error(error);
      }
   };

   const handleDelete = async (productUrl: string) => {
      try {
         const response = await axios.delete(`/api/v1/admin/products/${productUrl}`);

         return response.data;
      } catch (error) {
         console.error(error);
      }
   };

   const mutation = useMutation({
      mutationFn: (productUrl: string) => handleDelete(productUrl),
      onMutate: async (productUrl) => {
         await queryClient.cancelQueries({
            queryKey: ['products', url],
         });

         const previousData = queryClient.getQueryData(['products', url]);

         queryClient.setQueryData(['products', url], (oldData: { data: Product[] }) => {
            return {
               ...oldData,
               data: oldData.data.filter((item: Product) => item.url !== productUrl),
            };
         });

         return { previousData };
      },
      onError: (err, url, context) => {
         queryClient.setQueryData(['products', url], context.previousData);
         toast.error('Error deleting product', {
            autoClose: 1000,
            position: 'bottom-right',
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
         });
      },
      onSettled: () => {
         queryClient.invalidateQueries({
            queryKey: ['products', url],
         });
         toast.success('Product deleted successfully', {
            autoClose: 1000,
            position: 'bottom-right',
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
         });
      },
   });

   const handleMassAction = () => {
      if (!selectedItems.length) return;

      // TODO: Implement mass action
   };

   if (isPending) return <LoadingSpinner className="h-screen" />;
   if (isError) return <div>{error.message}</div>;

   return (
      <>
         <ToastContainer />

         <h1 className="p-2 text-3xl font-bold">Products</h1>
         <div className="mx-auto flex max-w-[1920px] justify-between space-x-4 p-2 sm:px-6 lg:px-8">
            <div className="flex w-full max-w-xs space-x-2">
               <select
                  onChange={(e) => setAction(e.target.value)}
                  value={action}
                  className="select select-bordered w-full max-w-xs"
               >
                  <option disabled value="">
                     Mass actions
                  </option>
                  <option value="delete">Delete selected</option>
               </select>
               <button onClick={handleMassAction} className="btn-default btn">
                  Apply
               </button>
            </div>
            <Link href={'/admin/products/create'} className="btn btn-success btn-wide text-white">
               Create Product
            </Link>
         </div>
         <Wrapper maxWidth="max-w-[1920px]">
            <div className="overflow-x-auto">
               {data.data.length > 0 ? (
                  <>
                     <table className="table">
                        <thead>
                           <tr>
                              <th>
                                 <label>
                                    <input
                                       onChange={handleSelectAll}
                                       checked={selectedItems.length === data.data.length}
                                       type="checkbox"
                                       className="checkbox"
                                    />
                                 </label>
                              </th>
                              <th onClick={() => handleSort('id')} className="cursor-pointer hover:bg-base-200">
                                 ID {sortBy === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
                              </th>
                              <th onClick={() => handleSort('name')} className="cursor-pointer hover:bg-base-200">
                                 Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                              </th>
                              <th onClick={() => handleSort('price')} className="cursor-pointer hover:bg-base-200">
                                 Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                              </th>
                              <th
                                 onClick={() => handleSort('is_published')}
                                 className="cursor-pointer hover:bg-base-200"
                              >
                                 Published {sortBy === 'is_published' && (sortOrder === 'asc' ? '↑' : '↓')}
                              </th>
                              <th>Action</th>
                           </tr>
                        </thead>
                        <motion.tbody variants={variants} initial="hidden" animate="show">
                           {data.data.map((item: Product) => (
                              <motion.tr
                                 variants={childVariants}
                                 key={item.id}
                                 className="odd:bg-base-100 even:bg-base-300"
                              >
                                 <td>
                                    <label>
                                       <input
                                          onChange={() => handleSelectOne(item.id)}
                                          checked={selectedItems.includes(item.id)}
                                          value={item.id}
                                          type="checkbox"
                                          className="checkbox"
                                       />
                                    </label>
                                 </td>
                                 <td>
                                    <div className="flex items-center gap-3">
                                       <div>
                                          <div className="font-bold">{item.id}</div>
                                       </div>
                                    </div>
                                 </td>
                                 <td>
                                    <div className="flex items-center gap-3">
                                       <div className="avatar">
                                          <Link href={`/p/${item.url}`} className="mask mask-squircle h-12 w-12">
                                             <Image
                                                src={item.main_image}
                                                alt={item.name}
                                                width={100}
                                                height={100}
                                                priority={true}
                                             />
                                          </Link>
                                       </div>
                                       <div>
                                          <div className="font-bold">{item.name}</div>
                                          <div className="text-sm opacity-50">{item.collection?.name}</div>
                                       </div>
                                    </div>
                                 </td>
                                 <td>
                                    <div className="flex items-center gap-3">
                                       <div>
                                          <div className="font-bold">{item.formatted_price}</div>
                                       </div>
                                    </div>
                                 </td>
                                 <td>
                                    <div className="flex items-center gap-3">
                                       <div>
                                          <div className="font-bold">
                                             <Switch
                                                checked={!!item.is_published}
                                                onChange={() => handlePublish(item)}
                                                className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-blue-600"
                                             >
                                                <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
                                             </Switch>
                                          </div>
                                       </div>
                                    </div>
                                 </td>
                                 <td>
                                    <div className="grid grid-cols-2 items-center gap-2">
                                       <Link
                                          href={'/admin/products/' + item.url + '/edit'}
                                          className="btn btn-outline btn-info btn-xs"
                                       >
                                          Edit
                                       </Link>
                                       <button
                                          onClick={() => {
                                             mutation.mutate(item.url);
                                          }}
                                          className="btn btn-outline btn-error btn-xs"
                                       >
                                          Delete
                                       </button>
                                       <Link
                                          href={'/admin/products/' + item.url + '/associations'}
                                          className="btn btn-outline btn-accent btn-xs col-span-2 "
                                       >
                                          Associations
                                       </Link>
                                    </div>
                                 </td>
                              </motion.tr>
                           ))}
                        </motion.tbody>
                     </table>
                     {(data.prev_page_url || data.next_page_url) && (
                        <div className="join mt-4 grid grid-cols-2">
                           <button
                              disabled={!data.prev_page_url}
                              onClick={() => setUrl(data.prev_page_url)}
                              className="btn btn-outline join-item"
                           >
                              Previous page
                           </button>
                           <button
                              disabled={!data.next_page_url}
                              onClick={() => setUrl(data.next_page_url)}
                              className="btn btn-outline join-item"
                           >
                              Next
                           </button>
                        </div>
                     )}
                  </>
               ) : (
                  <p>No data found...</p>
               )}
            </div>
         </Wrapper>
      </>
   );
}

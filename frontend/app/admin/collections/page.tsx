'use client';

import Wrapper from '../../ui/Wrapper';
import React, { useState } from 'react';
import axios from '../../lib/axios';
import Link from 'next/link';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { motion } from 'framer-motion';
import { Brand } from '../../types/brand';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export default function Collections() {
   const [url, setUrl] = useState('/api/v1/admin/collections');
   const [selectedItems, setSelectedItems] = useState<number[]>([]);

   const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
         setSelectedItems(data.data.map((item: Brand) => item.id));
         return;
      }
      setSelectedItems([]);
   };

   const handleSelectOne = (id: number) => {
      if (selectedItems.includes(id)) {
         setSelectedItems(selectedItems.filter((item) => item !== id));
      } else {
         setSelectedItems([...selectedItems, id]);
      }
   };

   const fetchData = async () => {
      const response = await axios.get(url, {
         params: {
            perPage: 5,
         },
      });

      return response.data;
   };

   const {
      data,
      isPending,
      refetch: refetchData,
      isError,
      error,
   } = useQuery({
      queryKey: ['collections', url],
      queryFn: fetchData,
   });

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

   const handleDelete = async (id: number) => {
      try {
         const response = await axios.delete(`/api/v1/admin/collections/${id}`);

         if (response.status === 200) {
            toast.success(response.data.message, {
               autoClose: 1000,
               position: 'bottom-right',
               hideProgressBar: true,
               closeOnClick: true,
               pauseOnHover: true,
            });
            await refetchData();
         }
      } catch (error) {
         toast.error(error.response.data.message, {
            autoClose: 1000,
            position: 'bottom-right',
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
         });
         console.error(error);
      }
   };

   if (isPending) return <LoadingSpinner className="h-screen" />;
   if (isError) return <div>{error.message}</div>;

   return (
      <>
         <h1 className="p-2 text-3xl font-bold">Collections</h1>
         <div className="mx-auto flex max-w-6xl justify-end p-2 sm:px-6 lg:px-8">
            <Link href={'/admin/collections/create'} className="btn btn-success btn-wide text-white">
               Create Collection
            </Link>
         </div>
         <Wrapper maxWidth="max-w-6xl">
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
                              <th>ID</th>
                              <th>Name</th>
                              <th>Action</th>
                           </tr>
                        </thead>
                        <motion.tbody variants={variants} initial="hidden" animate="show">
                           {data.data.map((item) => (
                              <motion.tr variants={childVariants} key={item.id}>
                                 <th>
                                    <label>
                                       <input
                                          onChange={() => handleSelectOne(item.id)}
                                          checked={selectedItems.includes(item.id)}
                                          value={item.id}
                                          type="checkbox"
                                          className="checkbox"
                                       />
                                    </label>
                                 </th>
                                 <td>
                                    <div className="flex items-center gap-3">
                                       <div>
                                          <div className="font-bold">{item.id}</div>
                                       </div>
                                    </div>
                                 </td>
                                 <td>
                                    <div className="flex items-center gap-3">
                                       <div>
                                          <div className="font-bold">{item.name}</div>
                                       </div>
                                    </div>
                                 </td>
                                 <th>
                                    <button
                                       onClick={() => handleDelete(item.id)}
                                       className="btn btn-outline btn-error btn-xs"
                                    >
                                       Delete
                                    </button>
                                 </th>
                              </motion.tr>
                           ))}
                        </motion.tbody>
                     </table>

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
                  </>
               ) : (
                  <p>No data found...</p>
               )}
            </div>
         </Wrapper>
      </>
   );
}

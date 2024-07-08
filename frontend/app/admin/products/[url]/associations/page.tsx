'use client';

import Wrapper from '../../../../ui/Wrapper';
import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../../../../ui/LoadingSpinner';
import axios from '../../../../lib/axios';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ValidationErrors } from '../../../../types/validation-errors';
import { Brand } from '../../../../types/brand';
import { useQuery } from '@tanstack/react-query';

export default function Associations({ params }) {
   const productUrl = params.url;
   const [url, setUrl] = useState('/api/v1/admin/products/' + productUrl + '/associations');
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
        queryKey: ['data'],
        queryFn: fetchData,
    });

   const fetchProduct = async () => {
      const response = await axios.get('/api/v1/admin/products/' + productUrl);

      return response.data.data;
   };

   const {
      data: product,
      isPending: isPendingProduct,
      refetch: refetchProduct,
      isError: isErrorProduct,
      error: errorProduct,
   } = useQuery({
      queryKey: ['product'],
      queryFn: fetchProduct,
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

    useEffect(() => {
        refetchData();
        refetchProduct();
    }, [refetchData, refetchProduct, url]);

    if (isPending || isPendingProduct) return <LoadingSpinner className="h-screen" />;
    if (isError) return <div>{error.message}</div>;
    if (isErrorProduct) return <div>{errorProduct.message}</div>;

   return (
      <>
         <h1 className="p-2 text-3xl font-bold">Associations for {product.name}</h1>
         <div className="mx-auto flex max-w-6xl justify-end p-2 sm:px-6 lg:px-8">
            <Link
               href={'/admin/products/' + productUrl + '/associations/create'}
               className="btn btn-success btn-wide text-white"
            >
               Create
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
                              <th>Attribute</th>
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
                                          <div className="font-bold">{item.variant.name}</div>
                                       </div>
                                    </div>
                                 </td>
                                 <td>
                                    <div className="flex items-center gap-3">
                                       <div>
                                          <div className="font-bold">{item.attribute.name}</div>
                                       </div>
                                    </div>
                                 </td>
                                 <td>
                                    <button className="btn btn-outline btn-error btn-xs">Delete</button>
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

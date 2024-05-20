'use client';

import Wrapper from '../../ui/Wrapper';
import { useEffect, useState } from 'react';
import axios from '../../lib/axios';
import Link from 'next/link';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { motion } from 'framer-motion';

export default function Categories() {
   const [data, setData] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [url, setUrl] = useState('/api/v1/admin/categories');
   const [selectedItems, setSelectedItems] = useState([]);

   const handleSelectAll = (event) => {
      if (event.target.checked) {
         setSelectedItems(data.data.map((item) => item.id));
         return;
      }
      setSelectedItems([]);
   };

   const handleSelectOne = (id) => {
      if (selectedItems.includes(id)) {
         setSelectedItems(selectedItems.filter((item) => item !== id));
      } else {
         setSelectedItems([...selectedItems, id]);
      }
   };

   const fetchData = () => {
      axios
         .get(url, {
            params: {
               perPage: 5,
            },
         })
         .then((response) => {
            setData(response.data);
         })
         .catch((error) => {
            console.error(error);
         })
         .finally(() => setIsLoading(false));
   };

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

   const handleDelete = (id) => {
      axios
         .delete(`/api/v1/admin/categories/${id}`)
         .then((response) => {
            // TODO: show notification
            fetchData();
         })
         .catch((error) => {
            // TODO: show notification
         });
   };

   useEffect(() => {
      fetchData();
   }, [url]);

   if (isLoading) return <LoadingSpinner className="h-screen" />;

   return (
      <>
         <h1 className="p-2 text-3xl font-bold">Categories</h1>
         <div className="mx-auto flex max-w-6xl justify-end p-2 sm:px-6 lg:px-8">
            <Link href={'/admin/categories/create'} className="btn btn-success btn-wide text-white">
               Create Category
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
                  <p>No data</p>
               )}
            </div>
         </Wrapper>
      </>
   );
}

'use client';

import { useEffect, useState } from 'react';
import axios from '../../../../lib/axios';
import Wrapper from '../../../../ui/Wrapper';
import LoadingSpinner from '../../../../ui/LoadingSpinner';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDoubleLeftIcon } from '@heroicons/react/24/outline';

export default function AttributeValues({ params }) {
   const [data, setData] = useState([]);
   const [attribute, setAttribute] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [isLoadingAttribute, setIsLoadingAttribute] = useState(true);
   const [url, setUrl] = useState('/api/v1/admin/attributes/' + params.id + '/attributeValues');
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
            // TODO: show notification
         })
         .finally(() => setIsLoading(false));
   };

   const fetchAttribute = () => {
      axios
         .get('/api/v1/admin/attributes/' + params.id)
         .then((response) => {
            setAttribute(response.data);
         })
         .catch((error) => {
            console.error(error);
         })
         .finally(() => setIsLoadingAttribute(false));
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
         .delete('/api/v1/admin/attributes/' + params.id + '/attributeValues/' + id)
         .then((response) => {
            // TODO: show notification
            fetchData();
         })
         .catch((error) => {
            // TODO: show notification
         });
   };

   useEffect(() => {
      fetchAttribute();
   }, []);

   useEffect(() => {
      fetchData();
   }, [url]);

   if (isLoading || isLoadingAttribute) return <LoadingSpinner className="h-screen" />;

   return (
      <>
         <h1 className="p-2 text-3xl font-bold">Values for {attribute.name}</h1>
         <div className="p-4">
            <Link href={'/admin/attributes/'} className="btn-default btn btn-outline">
               <ChevronDoubleLeftIcon className="h-6" />
            </Link>
         </div>
         <div className="mx-auto flex max-w-6xl justify-end p-2 sm:px-6 lg:px-8">
            <Link
               href={'/admin/attributes/' + params.id + '/values/create'}
               className="btn btn-success btn-wide text-white"
            >
               Create Value
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
                                    <div className="grid grid-cols-2 items-center gap-2">
                                       <Link
                                          href={'/admin/attributes/' + params.id + '/values/' + item.id + '/edit'}
                                          className="btn btn-outline btn-info btn-xs"
                                       >
                                          Edit
                                       </Link>
                                       <button
                                          onClick={() => handleDelete(item.id)}
                                          className="btn btn-outline btn-error btn-xs"
                                       >
                                          Delete
                                       </button>
                                    </div>
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

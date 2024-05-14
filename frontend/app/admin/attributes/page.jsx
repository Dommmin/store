'use client';

import Wrapper from '../../ui/Wrapper';
import { useEffect, useState } from 'react';
import axios from '../../lib/axios';
import Link from 'next/link';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Attributes() {
   const [data, setData] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [url, setUrl] = useState('/api/v1/admin/attributes');
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
            console.log(response);
            setData(response.data);
         })
         .catch((error) => {
            console.log(error);
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
         .delete(`/api/v1/admin/attributes/${id}`)
         .then((response) => {
            toast.success(response.data.message, {
               autoClose: 1000,
               position: 'bottom-right',
               hideProgressBar: true,
               closeOnClick: true,
               pauseOnHover: true,
            });
            fetchData();
         })
         .catch((error) => {
            toast.error(error.response.data.message, {
               autoClose: 1000,
               position: 'bottom-right',
               hideProgressBar: true,
               closeOnClick: true,
               pauseOnHover: true,
            });
         });
   };

   useEffect(() => {
      fetchData();
   }, [url]);

   if (isLoading) return <LoadingSpinner className="h-screen" />;

   return (
      <>
         <ToastContainer />
         <h1 className="text-3xl font-bold p-2">Attributes</h1>
         <div className="flex justify-end p-2 max-w-6xl mx-auto sm:px-6 lg:px-8">
            <Link href={'/admin/attributes/create'} className="btn btn-success btn-wide text-white">
               Create Attribute
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
                                    <div className="grid grid-cols-2 gap-2 items-center">
                                       <Link
                                          href={'/admin/attributes/' + item.id + '/edit'}
                                          className="btn btn-info btn-outline btn-xs"
                                       >
                                          Edit
                                       </Link>
                                       <button
                                          onClick={() => handleDelete(item.id)}
                                          className="btn btn-error btn-outline btn-xs"
                                       >
                                          Delete
                                       </button>
                                       <Link
                                          href={'/admin/attributes/' + item.id + '/values'}
                                          className="col-span-2 btn btn-accent btn-outline btn-xs "
                                       >
                                          Values
                                       </Link>
                                    </div>
                                 </th>
                              </motion.tr>
                           ))}
                        </motion.tbody>
                     </table>
                     {(data.prev_page_url || data.next_page_url) && (
                        <div className="join grid grid-cols-2 mt-4">
                           <button
                              disabled={!data.prev_page_url}
                              onClick={() => setUrl(data.prev_page_url)}
                              className="join-item btn btn-outline"
                           >
                              Previous page
                           </button>
                           <button
                              disabled={!data.next_page_url}
                              onClick={() => setUrl(data.next_page_url)}
                              className="join-item btn btn-outline"
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

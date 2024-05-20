'use client';

import Wrapper from '../../ui/Wrapper';
import { useEffect, useState } from 'react';
import axios from '../../lib/axios';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { motion } from 'framer-motion';
import { Switch } from '@headlessui/react';
import Link from 'next/link';
import Image from 'next/image';

export default function Reviews() {
   const [data, setData] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [url, setUrl] = useState('/api/v1/admin/reviews');
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
               perPage: 10,
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
         .delete(`/api/v1/admin/reviews/${id}`)
         .then((response) => {
            // TODO: show notification
            fetchData();
         })
         .catch((error) => {
            // TODO: show notification
            console.error(error);
         });
   };

   const handleApprove = (item) => {
      let action = 'approve';

      if (item.approved) {
         action = 'unapprove';
      }

      axios
         .post(`/api/v1/admin/reviews/${item.id}/${action}`)
         .then(() => {
            fetchData();
         })
         .catch((error) => {
            console.error(error);
         });
   };

   useEffect(() => {
      fetchData();
   }, [url]);

   if (isLoading) return <LoadingSpinner className="h-screen" />;

   return (
      <>
         <h1 className="p-2 text-3xl font-bold">Reviews</h1>
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
                              <th>ID</th>
                              <th>Title</th>
                              <th>Product</th>
                              <th>Posted by</th>
                              <th>Posted at</th>
                              <th>Approved</th>
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
                                          <div className="truncate font-bold">{item.title}</div>
                                       </div>
                                    </div>
                                 </td>
                                 <td>
                                    <div className="flex items-center gap-3">
                                       <ul className="avatar">
                                          <Link
                                             href={'/p/' + item.product.url}
                                             className="mask mask-squircle h-12 w-12"
                                          >
                                             <Image
                                                src={item.product.main_image}
                                                alt={item.product.title}
                                                width={100}
                                                height={100}
                                                blurDataURL={item.product.main_image}
                                                placeholder="blur"
                                             />
                                          </Link>
                                       </ul>
                                       <div>
                                          <div className="font-bold">{item.product.name}</div>
                                          {/*<div className="text-sm opacity-50">{item.product.name}</div>*/}
                                       </div>
                                    </div>
                                 </td>
                                 <td>
                                    <div className="flex items-center gap-3">
                                       <ul className="avatar">
                                          <li className="mask mask-squircle h-12 w-12">
                                             <Image
                                                src={item.user.profile_photo_url}
                                                alt={item.user.name}
                                                width={100}
                                                height={100}
                                                blurDataURL={item.user.profile_photo_url}
                                                placeholder="blur"
                                             />
                                          </li>
                                       </ul>
                                       <div>
                                          <div className="font-bold">{item.user.name}</div>
                                          <div className="text-sm opacity-50">{item.user.email}</div>
                                       </div>
                                    </div>
                                 </td>
                                 <td>
                                    <div className="flex items-center gap-3">
                                       <div>
                                          <div className="truncate font-bold">{item.created_at}</div>
                                       </div>
                                    </div>
                                 </td>
                                 <td>
                                    <div className="flex items-center gap-3">
                                       <div>
                                          <div className="font-bold">
                                             <Switch
                                                checked={!!item.approved}
                                                onChange={() => handleApprove(item)}
                                                className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-blue-600"
                                             >
                                                <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
                                             </Switch>
                                          </div>
                                       </div>
                                    </div>
                                 </td>
                                 <td>
                                    <button
                                       onClick={() => handleDelete(item.id)}
                                       className="btn btn-outline btn-error btn-xs"
                                    >
                                       Delete
                                    </button>
                                 </td>
                              </motion.tr>
                           ))}
                        </motion.tbody>
                     </table>
                     {(data.links.prev || data.links.next) && (
                        <div className="join mt-4 grid grid-cols-2">
                           <button
                              disabled={!data.links.prev}
                              onClick={() => setUrl(data.links.prev)}
                              className="btn btn-outline join-item"
                           >
                              Previous page
                           </button>
                           <button
                              disabled={!data.links.next}
                              onClick={() => setUrl(data.links.next)}
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

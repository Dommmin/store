'use client';

import axios from '../../lib/axios';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import LoadingSpinner from '../../ui/LoadingSpinner';
import Wrapper from '../../ui/Wrapper';
import Image from 'next/image';
import Link from 'next/link';

export default function Customers() {
   const [data, setData] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [url, setUrl] = useState('/api/v1/admin/customers');
   const [sortBy, setSortBy] = useState('id');
   const [searchQuery, setSearchQuery] = useState('');
   const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
   const [sortOrder, setSortOrder] = useState('desc');
   const [perPage] = useState(10);
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

   const handleSort = (field) => {
      if (sortBy === field) {
         setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      } else {
         setSortBy(field);
         setSortOrder('asc');
      }
   };

   const fetchData = () => {
      axios
         .get(url, { params: { sortBy, sortOrder, perPage, search: debouncedSearchQuery } })
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

   useEffect(() => {
      fetchData();
   }, [url, sortOrder, sortBy, perPage, debouncedSearchQuery]);

   if (isLoading) return <LoadingSpinner className="h-screen" />;

   return (
      <>
         <h1 className="p-2 text-3xl font-bold">Customers</h1>
         <Wrapper maxWidth="max-w-6xl">
            <label className="input input-bordered flex w-full items-center">
               <input
                  onChange={(event) => setSearchQuery(event.target.value)}
                  value={searchQuery}
                  type="text"
                  className="grow"
                  placeholder="Search"
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
                                       <ul className="avatar">
                                          <li className="mask mask-squircle h-12 w-12">
                                             <Image
                                                src={item.profile_photo_url}
                                                alt={item.name}
                                                width={100}
                                                height={100}
                                                blurDataURL={item.profile_photo_url}
                                                placeholder="blur"
                                             />
                                          </li>
                                       </ul>
                                       <div>
                                          <div className="font-bold">{item.name}</div>
                                          <div className="text-sm opacity-50">{item.email}</div>
                                       </div>
                                    </div>
                                 </td>
                                 <td>
                                    <Link
                                       className="btn btn-outline btn-primary btn-xs"
                                       href={'/admin/customers/' + item.id + '/orders'}
                                    >
                                       Orders
                                    </Link>
                                 </td>
                                 {/*<th>*/}
                                 {/*    <button*/}
                                 {/*        onClick={() => handleDelete(item.id)}*/}
                                 {/*        className="btn btn-error btn-outline btn-xs"*/}
                                 {/*    >Delete</button>*/}
                                 {/*</th>*/}
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

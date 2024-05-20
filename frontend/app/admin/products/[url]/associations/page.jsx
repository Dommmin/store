'use client';

import Wrapper from '../../../../ui/Wrapper';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../../../../ui/LoadingSpinner';
import axios from '../../../../lib/axios';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageNotFound from '../../../../../app/not-found';

export default function Associations({ params }) {
   const productUrl = params.url;
   const [data, setData] = useState([]);
   const [product, setProduct] = useState({});
   const [isLoading, setIsLoading] = useState(true);
   const [isLoadingProduct, setIsLoadingProduct] = useState(true);
   const [url, setUrl] = useState('/api/v1/admin/products/' + productUrl + '/associations');
   const [selectedItems, setSelectedItems] = useState([]);
   const [errors, setErrors] = useState([]);

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
            setErrors([...errors, error.response.data.message]);
            console.error(error);
         })
         .finally(() => setIsLoading(false));
   };

   const fetchProduct = () => {
      axios
         .get('/api/v1/admin/products/' + productUrl)
         .then((response) => {
            setProduct(response.data.data);
         })
         .catch((error) => {
            setErrors([...errors, error.response.data.message]);
            console.error(error);
         })
         .finally(() => setIsLoadingProduct(false));
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
      fetchProduct();
   }, [url]);

   if (isLoading || isLoadingProduct) return <LoadingSpinner className="h-screen" />;

   if (errors.length > 0) {
      return <PageNotFound />;
   }

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

'use client';

import Wrapper from '../../../../../ui/Wrapper';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../../../../../ui/LoadingSpinner';
import axios from '../../../../../lib/axios';
import PageNotFound from '../../../../../../app/not-found';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronDoubleLeftIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';

export default function Create({ params }) {
   const productUrl = params.url;
   const router = useRouter();
   const [attribute, setAttribute] = useState('');
   // const [products, setProducts] = useState([]);
   const [variant, setVariant] = useState('');
   // const [errors, setErrors] = useState([]);

   const fetchData = async () => {
      const response = await axios.get('/api/v1/admin/products/' + params.url + '/attributes');

      return response.data;
   };

   const { data, isPending, isError, error } = useQuery({
      queryKey: ['attributes'],
      queryFn: fetchData,
   });

   const fetchProducts = async () => {
      const response = await axios.get('/api/v1/admin/products', {
         params: {
            attribute: attribute,
            product: params.url,
         },
      });

      return response.data;
   };

   const {
      data: products,
      isPending: isProductsPending,
      refetch,
   } = useQuery({
      queryKey: ['products'],
      queryFn: fetchProducts,
      enabled: !!attribute,
   });

   const handleSubmit = (event) => {
      event.preventDefault();
      axios
         .post('/api/v1/admin/products/' + productUrl + '/associations', {
            attribute_id: attribute,
            variant_id: variant,
         })
         .then(() => {
            router.push('/admin/products/' + productUrl + '/associations');
         })
         .catch((error) => {
            console.error(error);
         });
   };

   useEffect(() => {
      refetch();
   }, [attribute, refetch]);

   if (isPending || isProductsPending) return <LoadingSpinner className="h-screen" />;
   if (isError) return <PageNotFound />;

   return (
      <>
         <div className="p-4">
            <Link href={'/admin/products/' + productUrl + '/associations'} className="btn-default btn btn-outline">
               <ChevronDoubleLeftIcon className="h-6" />
            </Link>
         </div>
         <Wrapper>
            <form onSubmit={handleSubmit} className="max-auto flex items-center justify-center">
               <div className="w-full max-w-3xl space-y-4">
                  <div className="flex space-x-4 p-6">
                     <label className="form-control w-full max-w-md">
                        <div className="label">
                           <span className="label-text">Attribute</span>
                        </div>
                        <select
                           className="select select-bordered"
                           onChange={(event) => setAttribute(event.target.value)}
                           value={attribute}
                        >
                           <option disabled value="">
                              Pick one
                           </option>
                           {data.map((item) => (
                              <option key={item.id} value={item.attribute.id}>
                                 {item.attribute.name}
                              </option>
                           ))}
                        </select>
                     </label>

                     <label className="form-control w-full max-w-md">
                        <div className="label">
                           <span className="label-text">Variant</span>
                        </div>
                        <select
                           className="select select-bordered"
                           onChange={(event) => setVariant(event.target.value)}
                           value={variant}
                        >
                           <option disabled value="">
                              Pick one
                           </option>
                           {products?.map((product) => (
                              <option key={product.id} value={product.id}>
                                 {product.name}
                              </option>
                           ))}
                        </select>
                     </label>
                  </div>
                  <button className="btn btn-primary w-full text-white" type="submit">
                     Submit
                  </button>
               </div>
            </form>
         </Wrapper>
      </>
   );
}

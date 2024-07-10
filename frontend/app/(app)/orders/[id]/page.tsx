import Wrapper from '../../../ui/Wrapper';
import LoadingSpinner from '../../../ui/LoadingSpinner';
import axios from '../../../lib/axios';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Product } from '../../../types/product';

interface OrderItem {
   id: number;
   product: Product;
   quantity: number;
}

export default function Order({ params }) {
   const fetchOrder = async () => {
      const response = await axios.get('/api/v1/orders/' + params.id);

      return response.data.data;
   };

   const {
      data: order,
      isPending,
      isError,
      error,
   } = useQuery({
      queryKey: ['order', params.id],
      queryFn: fetchOrder,
   });

   if (isPending) return <LoadingSpinner className="h-screen" />;
   if (isError) return <div>{error.message}</div>;

   return (
      <Wrapper>
         <div className="space-y-4">
            {order.items.map((item: OrderItem) => (
               <Link
                  href={`/p/${item.product.url}`}
                  key={item.id}
                  className="flex space-x-4 rounded-xl border border-neutral-200 bg-base-100 p-4 dark:border-neutral-700"
               >
                  <Image
                     className="rounded-xl"
                     src={item.product.main_image}
                     alt={item.product.name}
                     width={150}
                     height={150}
                  />
                  <div className="flex w-full flex-col justify-between">
                     <div>{item.product.name}</div>
                     <div />
                     <div className="flex justify-between">
                        <div>Quantity: {item.quantity}</div>
                        <div>{item.product.formatted_price} zł</div>
                     </div>
                  </div>
               </Link>
            ))}
         </div>
      </Wrapper>
   );
}

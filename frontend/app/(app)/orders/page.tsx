import axios from '../../lib/axios';
import { motion } from 'framer-motion';
import OrderItem from '../../ui/Order';
import Wrapper from '../../ui/Wrapper';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { useQuery } from '@tanstack/react-query';

interface Order {
   id: string;
}

export default function Orders() {
   const fetchOrders = async () => {
      const response = await axios.get('/api/v1/orders');

      return response.data;
   };

   // const { data : orders, isPending, isError, error } = useQuery({
   //    queryKey: ['orders'],
   //    queryFn: fetchOrders
   // });

   const variants = {
      hidden: { opacity: 0 },
      show: {
         opacity: 1,
         transition: {
            staggerChildren: 0.1,
         },
      },
   };

   // if (isPending) return <LoadingSpinner className="h-screen" />;
   // if (isError) return <p>{error.message}</p>;

   return (
      <Wrapper>
         <div>
            <h1>Orders</h1>
         </div>
         {/*<motion.div className="grid gap-4" variants={variants} initial="hidden" animate="show">*/}
         {/*{!orders.data.length ? <p>No orders found</p> : orders.data.map((order: Order) => (*/}
         {/*   <OrderItem key={order.id} order={order} />*/}
         {/*))}*/}
         {/*</motion.div>*/}
      </Wrapper>
   );
}

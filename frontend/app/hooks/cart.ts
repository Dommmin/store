import axios from '../lib/axios';
import { useQuery } from '@tanstack/react-query';

export const useCart = () => {
   const { data: cartItemsCount, refetch: refetchCart } = useQuery({
      queryKey: ['cart-items-count'],
      queryFn: async () => {
         const response = await axios.get('/api/v1/cart-items/count');
         return response.data;
      },
   });

   const {
      data: cartItems,
      isPending: isPendingCart,
      refetch,
   } = useQuery({
      queryKey: ['cart-items'],
      queryFn: async () => {
         const response = await axios.get('/api/v1/cart-items');
         return response.data;
      },
   });

   const { data: totalPrice, refetch: refetchTotal } = useQuery({
      queryKey: ['total-price'],
      queryFn: async () => {
         const response = await axios.get('/api/v1/cart-items/total');
         return response.data;
      },
   });

   const removeItem = async (id, productId) => {
      await axios.post('/api/v1/cart-items/remove', {
         id: id,
         product_id: productId,
      });

      refetch();
      refetchCart();
      refetchTotal();
   };

   const addToCart = async (productId: number | string, size: number | string) => {
      try {
         await axios.post('/api/v1/cart-items', {
            product_id: productId,
            size_id: size,
         });

         refetchCart();
         refetch();
         refetchTotal();
      } catch (error) {
         console.error('Error:', error);
      }
   };

   const incrementQuantity = async (id, productId) => {
      try {
         const response = await axios.post(`/api/v1/cart-items/increment`, {
            id: id,
            product_id: productId,
         });

         if (response.status === 200) {
            refetch();
            refetchCart();
            refetchTotal();
         }
      } catch (error) {
         console.error('Error:', error);
      }
   };

   const decrementQuantity = async (id: number, productId: number) => {
      try {
         const response = await axios.post(`/api/v1/cart-items/decrement`, {
            id: id,
            product_id: productId,
         });

         if (response.status === 200) {
            refetch();
            refetchCart();
            refetchTotal();
         }
      } catch (error) {
         console.error('Error:', error);
      }
   };

   return {
      cartItems,
      cartItemsCount,
      refetchCart,
      isPendingCart,
      handleRemoveItemFromCart: removeItem,
      handleAddToCart: addToCart,
      incrementQuantity,
      decrementQuantity,
      totalPrice,
      refetchTotal,
   };
};

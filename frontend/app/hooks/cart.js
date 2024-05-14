import useSWR from 'swr';
import axios from '../lib/axios.js';

export const useCart = () => {
   const { data: cartItemsCount, mutate: mutateCart } = useSWR(
      '/api/v1/cart-items/count',
      () => axios.get('/api/v1/cart-items/count').then((res) => res.data),
      { refreshInterval: 0 },
   );

   const {
      data: cartItems,
      mutate,
      isLoading: isLoadingCart,
   } = useSWR('/api/cart-items', () => axios.get('/api/v1/cart-items').then((res) => res.data));

   const removeItem = async (id, productId) => {
      await axios.post('/api/v1/cart-items/remove', {
         id: id,
         product_id: productId,
      });

      await mutate();
      await mutateCart();
      await mutateTotal();
   };

   const addToCart = async (productId, size) => {
      try {
         await axios.post('/api/v1/cart-items', {
            product_id: productId,
            size_id: size,
         });

         await mutateCart();
         await mutate();
         await mutateTotal();
      } catch (error) {
         console.error('Error:', error);
      }
   };

   const incrementQuantity = async (id, productId) => {
      await axios.post(`/api/v1/cart-items/increment`, {
         id: id,
         product_id: productId,
      });

      await mutate();
      await mutateCart();
      await mutateTotal();
   };

   const decrementQuantity = async (id, productId) => {
      await axios.post(`/api/v1/cart-items/decrement`, {
         id: id,
         product_id: productId,
      });
      await mutate();
      await mutateCart();
      await mutateTotal();
   };

   const { data: totalPrice, mutate: mutateTotal } = useSWR(
      '/api/cart-items/total',
      () => axios.get('/api/v1/cart-items/total').then((res) => res.data),
      { refreshInterval: 0 },
   );

   return {
      cartItems,
      cartItemsCount,
      mutateCart,
      isLoadingCart,
      handleRemoveItemFromCart: removeItem,
      handleAddToCart: addToCart,
      incrementQuantity,
      decrementQuantity,
      totalPrice,
      mutateTotal,
   };
};

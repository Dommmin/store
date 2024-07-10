import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function Cart(className) {
   return (
      <button name="cart" id="cart" className="btn flex items-center border-gray-700 hover:border-gray-700">
         <ShoppingBagIcon className={clsx('h-4 transition-all ease-in-out hover:scale-110  ', className)} />
      </button>
   );
}

import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function Cart(className) {
   return (
      <button className="btn border-gray-700 hover:border-gray-700 flex items-center">
         <ShoppingBagIcon className={clsx('h-4 transition-all ease-in-out hover:scale-110  ', className)} />
      </button>
   );
}

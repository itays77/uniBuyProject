import { useCart } from '@/context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';

const CartIcon = () => {
  const { itemCount } = useCart();
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate('/cart')}
      variant="ghost"
      className="font-bold hover:text-gray-800 hover:bg-white relative"
      aria-label="Shopping cart"
    >
      <ShoppingCart className="h-5 w-5" />

      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Button>
  );
};

export default CartIcon;

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Item } from '@/types';
import { toast } from 'sonner';

// Define CartItem type (item with quantity)
export type CartItem = Item & { quantity: number };

// Define the shape of our context
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Item) => void;
  removeFromCart: (itemNumber: string) => void;
  updateQuantity: (itemNumber: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Props for the provider component
interface CartProviderProps {
  children: ReactNode;
}

// Cart provider component
export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { isAuthenticated, user } = useAuth0();

  // Load cart from localStorage on initial render
  useEffect(() => {
    if (isAuthenticated && user) {
      const userId = user.sub;
      const savedCart = localStorage.getItem(`cart_${userId}`);

      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Failed to parse cart from localStorage:', error);
        }
      }
    }
  }, [isAuthenticated, user]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isAuthenticated && user) {
      const userId = user.sub;
      localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated, user]);

  // Calculate totals
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const taxRate = 0.07; // 7% tax
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  // Add item to cart
  const addToCart = (item: Item) => {
    if (!isAuthenticated) {
      toast.error('Please log in to add items to your cart');
      return;
    }

    setCartItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (cartItem) => cartItem.itemNumber === item.itemNumber
      );

      if (existingItemIndex !== -1) {
        // Item exists, update quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        toast.success(`Updated ${item.name} quantity in cart`);
        return updatedItems;
      } else {
        // Item doesn't exist, add new item
        toast.success(`Added ${item.name} to cart`);
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (itemNumber: string) => {
    setCartItems((prevItems) => {
      const itemToRemove = prevItems.find(
        (item) => item.itemNumber === itemNumber
      );
      if (itemToRemove) {
        toast.success(`Removed ${itemToRemove.name} from cart`);
      }
      return prevItems.filter((item) => item.itemNumber !== itemNumber);
    });
  };

  // Update item quantity
  const updateQuantity = (itemNumber: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(itemNumber);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.itemNumber === itemNumber ? { ...item, quantity } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    toast.info('Cart cleared');
  };

  // Context value
  const contextValue: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount,
    subtotal,
    tax,
    total,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

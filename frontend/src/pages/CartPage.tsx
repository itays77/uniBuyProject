import { useCart } from '@/context/CartContext';
import { useCreateOrder, useCreateCheckoutSession } from '@/api/OrderApi';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const CartPage = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    tax,
    total,
  } = useCart();
  const { isAuthenticated, loginWithRedirect, user } = useAuth0();
  const navigate = useNavigate();
  const { createOrder, isLoading: isCreatingOrder } = useCreateOrder();
  const { createCheckoutSession, isLoading: isCreatingCheckoutSession } =
    useCreateCheckoutSession();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQuantityChange = (
    itemNumber: string,
    change: number,
    currentQuantity: number
  ) => {
    updateQuantity(itemNumber, currentQuantity + change);
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      loginWithRedirect({
        appState: { returnTo: '/cart' },
      });
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create the order
      const orderItems = cartItems.map((item) => ({
        itemNumber: item.itemNumber,
        quantity: item.quantity,
      }));

      const order = await createOrder({ items: orderItems });
      toast.success('Order created successfully!');

      // Step 2: Create UniPaas checkout session
      const checkoutSession = await createCheckoutSession({
        orderId: order._id,
        customerEmail: user?.email,
      });

      // Clear the cart when redirecting to payment
      clearCart();

      // Step 3: Redirect to UniPaas checkout page
      window.location.href = checkoutSession.checkoutUrl;
    } catch (error) {
      toast.error('Failed to process checkout. Please try again.');
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sign In Required</CardTitle>
              <CardDescription>
                You need to be logged in to view your cart
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-4">
              <ShoppingBag className="h-16 w-16 text-gray-400" />
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                onClick={() =>
                  loginWithRedirect({ appState: { returnTo: '/cart' } })
                }
              >
                Sign In
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Your Cart is Empty</CardTitle>
            <CardDescription>Add some items to get started</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-4">
            <ShoppingBag className="h-16 w-16 text-gray-400" />
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              onClick={() => navigate('/items')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Browse Items
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Items ({cartItems.length})</CardTitle>
                <Button variant="outline" size="sm" onClick={clearCart}>
                  Clear Cart
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.itemNumber}
                    className="flex items-center space-x-4"
                  >
                    <div className="flex-shrink-0 h-14 w-14 bg-gray-100 rounded-md flex items-center justify-center text-2xl">
                      {item.country.slice(0, 2)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.country} • {item.kitType} • {item.season}
                      </p>
                    </div>

                    <div className="flex-shrink-0 flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          handleQuantityChange(
                            item.itemNumber,
                            -1,
                            item.quantity
                          )
                        }
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>

                      <span className="w-8 text-center">{item.quantity}</span>

                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          handleQuantityChange(
                            item.itemNumber,
                            1,
                            item.quantity
                          )
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex-shrink-0 w-20 text-right font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>

                    <div className="flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeFromCart(item.itemNumber)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => navigate('/items')}
              >
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax (7%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                className="w-full flex items-center justify-center gap-2"
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                <CreditCard className="h-4 w-4" />
                {isProcessing ? 'Processing...' : 'Checkout'}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Secure checkout powered by payment simulation
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

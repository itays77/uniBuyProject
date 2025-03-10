import { useParams, useNavigate } from 'react-router-dom';
import { useGetOrderById } from '@/api/OrderApi';
import { useGetMyUser } from '@/api/MyUserApi';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  CheckCircle,
  Home,
  Package,
  Loader2,
  AlertCircle,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import { OrderStatus } from '@/types';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const { order, isLoading: isOrderLoading } = useGetOrderById(orderId || '');

  const { currentUser, isLoading: isUserLoading } = useGetMyUser();

  // Check if user has permission to view this order
  useEffect(() => {
    // Only run this check when we have both order and user data
    if (!isOrderLoading && !isUserLoading && order && currentUser) {
      // Compare MongoDB IDs (convert both to strings to ensure format matching)
      const orderUserId = String(order.user);
      const currentUserId = String(currentUser._id);

      if (orderUserId !== currentUserId) {
        // User ID mismatch - this order doesn't belong to the current user
        if (process.env.NODE_ENV === 'production') {
          toast.error("You don't have permission to view this order");
          navigate('/');
        } else {
          toast.warning('Note: User ID mismatch (ignored in development)');
        }
      }
    }
  }, [order, isOrderLoading, currentUser, isUserLoading, navigate]);

  // Handle not authenticated case
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to view your order details
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-4">
            <AlertCircle className="h-16 w-16 text-yellow-400" />
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              onClick={() =>
                loginWithRedirect({
                  appState: { returnTo: window.location.pathname },
                })
              }
            >
              Sign In
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Show loading state while fetching order or user data
  if (isOrderLoading || isUserLoading) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Loading Order Details</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center pb-4">
            <Loader2 className="h-16 w-16 text-gray-400 animate-spin" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle order not found
  if (!order) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Order Not Found</CardTitle>
            <CardDescription>
              We couldn't find your order details
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-4">
            <AlertCircle className="h-16 w-16 text-red-400" />
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => navigate('/items')}>Browse Items</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Determine the display based on order status
  const isPaid = order.status === OrderStatus.PAID;
  const isFailed = order.status === OrderStatus.FAILED;
  const isPending = order.status === OrderStatus.PENDING;

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            {isPaid && <CheckCircle className="h-16 w-16 text-green-500" />}
            {isFailed && <XCircle className="h-16 w-16 text-red-500" />}
            {isPending && (
              <Loader2 className="h-16 w-16 text-yellow-500 animate-spin" />
            )}
          </div>
          <CardTitle className="text-3xl">
            {isPaid && 'Payment Successful!'}
            {isFailed && 'Payment Failed!'}
            {isPending && 'Order Received!'}
          </CardTitle>
          <CardDescription className="text-lg">
            Your order #{order.orderNumber} has been{' '}
            {isPaid ? 'paid' : isFailed ? 'declined' : 'placed'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Display failure reason if payment failed */}
          {isFailed && order.failureReason && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
              <h3 className="font-medium flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                Payment Failed
              </h3>
              <p className="mt-1 text-sm">{order.failureReason}</p>
            </div>
          )}

          <div className="border-t border-b py-4 mb-4">
            <h3 className="font-medium text-lg mb-2">Order Summary</h3>

            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>
                    {item.name} ({item.quantity} x ${item.price.toFixed(2)})
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t mt-4 pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="text-center text-gray-600">
            <p>Thank you for your order!</p>
            <p className="mt-2 text-sm text-gray-500">
              {isPaid && 'Your payment has been processed successfully.'}
              {isFailed &&
                'Unfortunately, your payment could not be processed.'}
              {isPending &&
                'Your payment is being processed through UniPaas sandbox.'}
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Return to Home
          </Button>

          <Button
            onClick={() => navigate('/items')}
            className="flex items-center gap-2"
          >
            <Package className="h-4 w-4" />
            {isFailed ? 'Shop Items' : 'Continue Shopping'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OrderConfirmationPage;

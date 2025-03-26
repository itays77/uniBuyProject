// CheckoutPage.tsx
import { useParams, useSearchParams } from 'react-router-dom';
import UniPaasCheckout from '@/components/UniPaasCheckout';
import { useGetOrderById } from '@/api/OrderApi';
import { Loader2 } from 'lucide-react';

const CheckoutPage = () => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const sessionToken = searchParams.get('token');
  const { isLoading } = useGetOrderById(orderId || '');

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading order information...</span>
      </div>
    );
  }

  if (!orderId || !sessionToken) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h2 className="text-2xl font-bold text-red-600">
          Missing required checkout information
        </h2>
        <p className="mt-4">Please return to your cart and try again.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-xl">
      <h1 className="text-2xl font-bold mb-8">Complete Your Purchase</h1>
      <UniPaasCheckout sessionToken={sessionToken} orderId={orderId} />
    </div>
  );
};

export default CheckoutPage;

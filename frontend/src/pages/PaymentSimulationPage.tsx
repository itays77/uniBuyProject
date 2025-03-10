import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CreditCard, CheckCircle, XCircle } from 'lucide-react';
import TestCardsInfo from '../components/TestCardsInfo ';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PaymentSimulationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  const reference = searchParams.get('reference');

  useEffect(() => {
    if (!orderId || !amount || !reference) {
      toast.error('Missing required payment information');
      navigate('/cart');
    }
  }, [orderId, amount, reference, navigate]);

  const handlePaymentSuccess = async () => {
    try {
      setIsProcessing(true);
      const response = await fetch(
        `${API_BASE_URL}/api/orders/simulate-payment/${orderId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to process payment');
      }

      toast.success('Payment processed successfully!');

      // Redirect to order confirmation page
      navigate(`/order-confirmation/${orderId}`);
    } catch (error) {
      console.error('Payment simulation error:', error);
      toast.error('Failed to process payment simulation');
      setIsProcessing(false);
    }
  };

  const handlePaymentFailure = async () => {
    try {
      setIsProcessing(true);

      // Call the new endpoint for payment failure simulation
      const response = await fetch(
        `${API_BASE_URL}/api/orders/simulate-payment-failure/${orderId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reason: 'Payment declined: Insufficient funds',
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to process payment failure');
      }

      toast.error('Payment was declined');

      // Redirect to order confirmation page anyway to show the failed status
      navigate(`/order-confirmation/${orderId}`);
    } catch (error) {
      console.error('Payment failure simulation error:', error);
      toast.error('Failed to process payment simulation');
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Payment Simulation</CardTitle>
          <CardDescription>
            This is a simulated payment page for testing purposes
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Order Details</h3>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-500">Order Reference:</span>
                <span className="font-medium">{reference}</span>
                <span className="text-gray-500">Amount:</span>
                <span className="font-medium">${amount}</span>
              </div>
            </div>

            <TestCardsInfo />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={handlePaymentSuccess}
            disabled={isProcessing}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            {isProcessing ? 'Processing...' : 'Simulate Successful Payment'}
          </Button>

          <Button
            variant="outline"
            className="w-full text-red-600 border-red-200 hover:bg-red-50"
            onClick={handlePaymentFailure}
            disabled={isProcessing}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Simulate Failed Payment
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentSimulationPage;
import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface UniPaasCheckoutProps {
  sessionToken: string;
  orderId: string;
}

const UniPaasCheckout = ({ sessionToken, orderId }: UniPaasCheckoutProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const checkoutRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(
      'UniPaasCheckout component mounted with token:',
      sessionToken.substring(0, 10) + '...'
    );

    if (!sessionToken) {
      toast.error('Missing session token');
      return;
    }

    // Create a script element for the UniPaas SDK
    const loadScript = () => {
      return new Promise<void>((resolve, reject) => {
        // Check if script is already loaded
        if (document.getElementById('unipaas-script')) {
          console.log('UniPaas script already loaded');
          resolve();
          return;
        }

        console.log('Loading UniPaas script...');
        const script = document.createElement('script');
        script.id = 'unipaas-script';
        script.src = 'https://cdn.unipaas.com/checkout-embedded.sandbox.js'; // Use this exact URL
        script.type = 'application/javascript';
        script.async = true;

        script.onload = () => {
          console.log('UniPaas script loaded successfully');
          resolve();
        };

        script.onerror = () => {
          console.error('Failed to load UniPaas script');
          reject(new Error('Failed to load UniPaas script'));
        };

        document.head.appendChild(script);
      });
    };

    const initializeCheckout = async () => {
      try {
        await loadScript();

        console.log('Window unipaas object:', window.unipaas);
        console.log(
          'UniPaas checkout container:',
          document.getElementById('unipaas-checkout-container')
        );

        // Check if the unipaas object is available in the window
        if (!window.unipaas) {
          throw new Error(
            'UniPaas script loaded but unipaas object not available'
          );
        }

        // Avoid mounting multiple times
        if (mountedRef.current) {
          console.log('Checkout already mounted, skipping');
          return;
        }

        console.log('Initializing UniPaas with token');

        // Configure theme
        const config = {
          theme: {
            type: 'light',
            variables: {
              primaryBackgroundColor: '#ffffff',
              secondaryBackgroundColor: '#f9fafb',
              primaryTextColor: '#1f2937',
              secondaryTextColor: '#6b7280',
              primaryButtonColor: '#2563eb',
              primaryButtonLabelColor: '#ffffff',
              secondaryButtonColor: '#d1d5db',
              buttonBorderRadius: '0.375rem',
              primaryInputBackgroundColor: '#ffffff',
              primaryInputBorderColor: '#d1d5db',
              primaryInputLabelColor: '#4b5563',
              inputBorderRadius: '0.375rem',
              digitalWalletButtonMode: 'black',
            },
          },
        };

        // Initialize components - IMPORTANT: Use components not buyerComponents per documentation
        console.log('Creating components with session token');
        const components = window.unipaas.components(sessionToken, config);

        // Set up event listeners for payment status updates
        components.on('paymentSuccess', (e: any) => {
          console.log('Payment successful:', e.detail);
          toast.success('Payment successful!');
          navigate(`/order-confirmation/${orderId}`);
        });

        components.on('paymentError', (e: any) => {
          console.error('Payment error:', e.detail);
          toast.error(
            'Payment failed: ' + (e.detail.message || 'Unknown error')
          );
        });

        components.on('paymentCancel', (e: any) => {
          console.log('Payment cancelled:', e.detail);
          toast.info('Payment was cancelled');
        });

        // Check if the container exists and mount the checkout component
        if (checkoutRef.current) {
          console.log('Creating checkout component');
          const checkout = components.create('checkout');
          checkout.mount('#unipaas-checkout-container');
          console.log('Checkout component mounted successfully');
          mountedRef.current = true;
        } else {
          console.error('Checkout container element not found');
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing UniPaas checkout:', error);
        toast.error('Failed to initialize payment system');
        setIsLoading(false);
      }
    };

    initializeCheckout();

    // Cleanup when component unmounts
    return () => {
      mountedRef.current = false;
    };
  }, [sessionToken, orderId, navigate]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Secure Checkout</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading secure payment...</span>
          </div>
        ) : (
          <div
            id="unipaas-checkout-container"
            ref={checkoutRef}
            style={{ minHeight: '400px', minWidth: '360px' }}
          />
        )}
      </CardContent>
    </Card>
  );
};

// Define the global unipaas interface
declare global {
  interface Window {
    unipaas: any;
  }
}

export default UniPaasCheckout;

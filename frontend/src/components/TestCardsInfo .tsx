import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Copy, CreditCard, Info, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface TestCardInfo {
  name: string;
  number: string;
  expiry: string;
  cvv: string;
  description: string;
  type: 'success' | 'error' | 'challenge';
}

const testCards: TestCardInfo[] = [
  {
    name: 'John Doe',
    number: '4761 3441 3614 1390',
    expiry: '02/34',
    cvv: '123',
    description: 'Successful simple transaction (valid for amounts up to 100)',
    type: 'success',
  },
  {
    name: 'FL-BRW1',
    number: '4000 0209 5159 5032',
    expiry: '02/34',
    cvv: '123',
    description: 'Successful transaction with 3DS frictionless authentication',
    type: 'success',
  },
  {
    name: 'CL-BRW2',
    number: '2221 0081 2367 7736',
    expiry: '12/24',
    cvv: '123',
    description: 'Successful transaction with 3DS Challenge Flow',
    type: 'challenge',
  },
  {
    name: 'Decline',
    number: '4008 3708 9666 2369',
    expiry: 'Any future date',
    cvv: '123',
    description: 'Declined transaction',
    type: 'error',
  },
  {
    name: 'Insufficient Funds',
    number: '4008 3844 2437 0890',
    expiry: 'Any future date',
    cvv: '123',
    description: 'Insufficient funds error',
    type: 'error',
  },
  {
    name: 'Lost/Stolen',
    number: '4000 1574 5462 7969',
    expiry: 'Any future date',
    cvv: '123',
    description: 'Lost/Stolen card error',
    type: 'error',
  },
];

const copyToClipboard = (text: string, label: string) => {
  navigator.clipboard.writeText(text);
  toast.success(`${label} copied to clipboard!`);
};

const TestCardsInfo: React.FC = () => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Info className="h-5 w-5 text-blue-500" />
        <h3 className="font-medium text-gray-900">Payment Testing Options</h3>
      </div>

      <Alert className="mb-4">
        <AlertTitle className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Test Payment Environment
        </AlertTitle>
        <AlertDescription>
          This is a simulation environment. Use the buttons below to test both
          successful and failed payment outcomes. For a real integration, you
          would use test cards instead.
        </AlertDescription>
      </Alert>

      <div className="space-y-4 mb-4">
        <div className="p-3 rounded-lg border border-green-100 bg-green-50">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <h4 className="font-medium text-gray-900">Successful Payment</h4>
          </div>
          <p className="text-sm text-gray-600">
            Clicking "Simulate Successful Payment" will process your order
            successfully. The order status will be updated to "PAID" and you'll
            see a confirmation screen.
          </p>
        </div>

        <div className="p-3 rounded-lg border border-red-100 bg-red-50">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="h-4 w-4 text-red-600" />
            <h4 className="font-medium text-gray-900">Failed Payment</h4>
          </div>
          <p className="text-sm text-gray-600">
            Clicking "Simulate Failed Payment" will simulate a payment failure.
            The order status will be updated to "FAILED" with a reason like
            "Insufficient funds" and you'll see the appropriate error message.
          </p>
        </div>
      </div>

      <Accordion type="single" collapsible>
        <AccordionItem value="test-cards">
          <AccordionTrigger>View Real-World Test Cards</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-gray-600 mb-3">
              In a real payment integration, you would use these test cards to
              simulate different payment scenarios:
            </p>
            <div className="space-y-4 max-h-80 overflow-y-auto p-2">
              {testCards.map((card, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    card.type === 'success'
                      ? 'border-green-100 bg-green-50'
                      : card.type === 'error'
                      ? 'border-red-100 bg-red-50'
                      : 'border-yellow-100 bg-yellow-50'
                  }`}
                >
                  <div className="flex justify-between mb-2">
                    <p className="font-medium text-gray-900">
                      {card.description}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() =>
                        copyToClipboard(
                          card.number.replace(/\s/g, ''),
                          'Card number'
                        )
                      }
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-600">Card Number:</p>
                      <p className="font-mono">{card.number}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Name:</p>
                      <p>{card.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Expiry:</p>
                      <p>{card.expiry}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">CVV:</p>
                      <p>{card.cvv}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default TestCardsInfo;

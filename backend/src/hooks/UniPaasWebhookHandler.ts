import { Request, Response } from 'express';
import { createHmac } from 'crypto';
import Order, { OrderStatus } from '../models/order';

// Webhook handler for UniPaas notifications
const unipaasWebhookHandler = async (req: Request, res: Response) => {
  try {
    // Extract headers and body
    const { headers, body } = req;
    const signedHeader = headers['x-hmac-sha256'] as string;

    // Verify the webhook signature
    const hash = createHmac('sha256', process.env.UNIPAAS_SECRET_KEY as string)
      .update(JSON.stringify(body))
      .digest('hex');
    const buff = Buffer.from(hash);
    const calculated = buff.toString('base64');

    // If signature doesn't match, reject the webhook
    if (calculated !== signedHeader) {
      console.error('Failed to verify webhook signature!');
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }

    // Log the webhook event
    console.log('Webhook verified successfully', {
      type: body.type,
      data: body.data,
    });

    // Process different webhook event types
    switch (body.type) {
      case 'payment/succeeded':
        await handlePaymentSucceeded(body.data);
        break;

      case 'payment/failed':
        await handlePaymentFailed(body.data);
        break;

      // Handle other webhook types as needed
      default:
        console.log(`Unhandled webhook type: ${body.type}`);
    }

    // Always respond with 200 to acknowledge receipt
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);

    // Still return 200 to prevent UniPaas from retrying
    // But log the error for debugging
    res.status(200).json({
      received: true,
      error: 'Error processing webhook, but acknowledged receipt',
    });
  }
};

// Handler for successful payments
async function handlePaymentSucceeded(data: any) {
  try {
    // Extract the order ID from metadata
    const orderId = data.metadata?.orderId;

    if (!orderId) {
      console.error('Missing orderId in payment metadata');
      return;
    }

    // Update the order status to PAID
    await Order.findByIdAndUpdate(orderId, {
      status: OrderStatus.PAID,
      paymentId: data.id,
    });

    console.log(`Order ${orderId} marked as PAID`);

  
  } catch (error) {
    console.error('Error processing payment/succeeded webhook:', error);
  }
}

// Handler for failed payments
async function handlePaymentFailed(data: any) {
  try {
    const orderId = data.metadata?.orderId;

    if (!orderId) {
      console.error('Missing orderId in payment metadata');
      return;
    }

    // For failed payments,  keep the order as PENDING
    console.log(`Payment failed for order ${orderId}, status remains PENDING`);

  } catch (error) {
    console.error('Error processing payment/failed webhook:', error);
  }
}

export default unipaasWebhookHandler;

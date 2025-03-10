import { Request, Response } from 'express';
import Order, { OrderStatus } from '../models/order';
import { createHmac } from 'crypto';

/**
 * Test function to try different UniPaas API endpoints
 */
const testUniPaasConnection = async (req: Request, res: Response) => {
  try {
    // Try connecting to the sandbox endpoint directly
    try {
      const sandboxUrl =
        process.env.UNIPAAS_SANDBOX_URL || 'https://sandbox.unipaas.com';
      console.log(`Testing connection to UniPaas sandbox at: ${sandboxUrl}`);

      const response = await fetch(`${sandboxUrl}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.UNIPAAS_API_KEY}`,
          Accept: 'application/json',
        },
      });

      console.log('Connection response:', {
        status: response.status,
        statusText: response.statusText,
      });

      res.status(200).json({
        message: 'Successfully tested connection to UniPaas sandbox',
        status: response.status,
        endpoint: sandboxUrl,
      });
    } catch (error) {
      console.error('Error connecting to UniPaas:', error);
      res.status(500).json({
        message: 'Error connecting to UniPaas',
        error: (error as Error).message,
      });
    }
  } catch (error) {
    console.error('Error testing UniPaas connections:', error);
    res.status(500).json({
      message: 'Error testing connections',
      error: (error as Error).message,
    });
  }
};

/**
 * Create checkout session with UniPaas
 */
const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { orderId, customerEmail } = req.body;
    const userId = req.userId;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    // Get the order
    const orderInstance = await Order.findById(orderId);

    if (!orderInstance) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (orderInstance.status !== OrderStatus.PENDING) {
      return res
        .status(400)
        .json({ message: 'Order is not in PENDING status' });
    }

    // Check if user has permission to access this order
    if (orderInstance.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: 'Not authorized to access this order' });
    }

    // Log order details for debugging
    console.log('Processing order for checkout:', {
      orderId: orderInstance._id,
      orderNumber: orderInstance.orderNumber,
      total: orderInstance.total,
    });

    // Create checkout URL
    console.log('Creating UniPaas checkout session...');

    // Use the direct checkout URL approach which doesn't require API access
    const sandboxDomain = 'checkout.sandbox.unipaas.com';
    const checkoutUrl = `${
      process.env.FRONTEND_URL
    }/payment-simulation?orderId=${
      orderInstance._id
    }&amount=${orderInstance.total.toFixed(2)}&reference=${
      orderInstance.orderNumber
    }`;

    console.log(`Generated checkout URL: ${checkoutUrl}`);

    // Update the order with the payment session info
    orderInstance.paymentSessionId = `direct_${Date.now()}`;
    await orderInstance.save();

    res.status(200).json({
      checkoutUrl: checkoutUrl,
      sessionId: orderInstance.paymentSessionId,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      message: 'Error creating checkout session',
      error: (error as Error).message,
    });
  }
};

/**
 * Webhook handler for UniPaas notifications
 */
const unipaasWebhookHandler = async (req: Request, res: Response) => {
  try {
    // Log the raw request for debugging
    console.log('Webhook received: ', {
      headers: req.headers,
      body: req.body,
    });

    // Extract headers and body
    const { headers, body } = req;
    const signedHeader = headers['x-hmac-sha256'] as string;

    // Parse body if needed
    let webhookData = body;
    if (Buffer.isBuffer(webhookData)) {
      try {
        webhookData = JSON.parse(webhookData.toString('utf8'));
      } catch (e) {
        console.error('Failed to parse webhook payload:', e);
        return res.status(200).json({ error: 'Invalid JSON payload' });
      }
    }

    // Verify webhook signature using the correct secret key
    if (signedHeader && process.env.UNIPAAS_SECRET_KEY) {
      const hash = createHmac(
        'sha256',
        process.env.UNIPAAS_SECRET_KEY as string
      )
        .update(JSON.stringify(webhookData))
        .digest('hex');
      const buff = Buffer.from(hash);
      const calculated = buff.toString('base64');

      if (calculated !== signedHeader) {
        console.warn(
          'Warning: Webhook signature verification failed - accepting anyway in sandbox mode'
        );
      } else {
        console.log('Webhook signature verification successful');
      }
    }

    // Process different webhook event types
    const eventType = webhookData.type || webhookData.event;
    const orderId =
      webhookData.metadata?.orderId ||
      (webhookData.data && webhookData.data.metadata?.orderId);

    console.log(`Processing webhook event: ${eventType}, Order ID: ${orderId}`);

    if (
      eventType === 'payment/succeeded' ||
      eventType === 'payment.succeeded'
    ) {
      if (orderId) {
        // Update the order status to PAID
        const updatedOrder = await Order.findByIdAndUpdate(
          orderId,
          {
            status: OrderStatus.PAID,
            paymentId:
              webhookData.payment_id ||
              webhookData.data?.id ||
              `webhook_${Date.now()}`,
          },
          { new: true }
        );

        if (updatedOrder) {
          console.log(`Order ${orderId} marked as PAID`);
        } else {
          console.error(`Order ${orderId} not found for payment update`);
        }
      } else {
        console.error('No orderId found in payment webhook metadata');
      }
    } else if (
      eventType === 'payment/failed' ||
      eventType === 'payment.failed'
    ) {
      console.log(`Payment failed for order ${orderId}`);

      if (orderId) {
        // Update the order with a FAILED status and reason
        const reason =
          webhookData.reason ||
          webhookData.data?.reason ||
          'Payment processing failed';

        const updatedOrder = await Order.findByIdAndUpdate(
          orderId,
          {
            status: OrderStatus.FAILED,
            failureReason: reason,
          },
          { new: true }
        );

        if (updatedOrder) {
          console.log(`Order ${orderId} marked as FAILED. Reason: ${reason}`);
        } else {
          console.error(`Order ${orderId} not found for failure update`);
        }
      }
    } else {
      console.log(`Unhandled webhook event: ${eventType}`);
    }

    // Always respond with 200 to acknowledge receipt
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);

    // Still return 200 to prevent retrying
    res.status(200).json({
      received: true,
      error: 'Error processing webhook, but acknowledged receipt',
    });
  }
};

const simulatePaymentSuccess = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      res.status(400).json({ message: 'Order ID is required' });
      return;
    }

    const order = await Order.findById(orderId);

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // Update order status to PAID
    order.status = OrderStatus.PAID;
    order.paymentId = `simulated_payment_${Date.now()}`;
    await order.save();

    console.log(`Simulated payment successful for order ${orderId}`);

    res.status(200).json({
      message: 'Order payment simulated successfully',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        total: order.total,
      },
    });
  } catch (error) {
    console.error('Error simulating payment:', error);
    res.status(500).json({
      message: 'Error simulating payment',
      error: (error as Error).message,
    });
  }
};

/**
 * Handle simulated payment failure
 */
const simulatePaymentFailure = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { reason = 'Payment was declined' } = req.body;

    if (!orderId) {
      res.status(400).json({ message: 'Order ID is required' });
      return;
    }

    const order = await Order.findById(orderId);

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // Update order status to FAILED
    order.status = OrderStatus.FAILED;
    order.failureReason = reason;
    await order.save();

    console.log(`Simulated payment failure for order ${orderId}: ${reason}`);

    res.status(200).json({
      message: 'Order payment failure simulated successfully',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        failureReason: order.failureReason,
        total: order.total,
      },
    });
  } catch (error) {
    console.error('Error simulating payment failure:', error);
    res.status(500).json({
      message: 'Error simulating payment failure',
      error: (error as Error).message,
    });
  }
};

// Export the functions
export {
  testUniPaasConnection,
  createCheckoutSession,
  unipaasWebhookHandler,
  simulatePaymentSuccess,
  simulatePaymentFailure,
};

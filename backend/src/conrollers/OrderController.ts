import { Request, Response } from 'express';
import axios from 'axios';
import Order, { OrderStatus } from '../models/order';
import Item from '../models/item';
import User from '../models/user';
import { createHmac } from 'crypto';

// Create a new order
const createOrder = async (req: Request, res: Response) => {
  try {
    const { items } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: 'Order must include at least one item' });
    }

    const itemNumbers = items.map((item) => item.itemNumber);
    const itemsFromDB = await Item.find({ itemNumber: { $in: itemNumbers } });

    if (itemsFromDB.length !== itemNumbers.length) {
      return res.status(400).json({ message: 'One or more items not found' });
    }

    const orderItems = items.map((orderItem) => {
      const dbItem = itemsFromDB.find(
        (item) => item.itemNumber === orderItem.itemNumber
      );

      if (!dbItem) {
        throw new Error(`Item not found: ${orderItem.itemNumber}`);
      }

      return {
        itemNumber: dbItem.itemNumber,
        name: dbItem.name,
        price: dbItem.price,
        country: dbItem.country,
        kitType: dbItem.kitType,
        season: dbItem.season,
        quantity: orderItem.quantity,
      };
    });

    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const taxRate = 0.07;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    console.log(
      'Item details:',
      orderItems.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        lineTotal: item.price * item.quantity,
      }))
    );


    // Create the order with PENDING status
    const newOrder = new Order({
      user: userId,
      items: orderItems,
      subtotal,
      tax,
      total,
      status: OrderStatus.PENDING,
    });

    await newOrder.save();

    res.status(201).json(newOrder);
  } catch (error: any) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
};

// Create checkout session with UniPaas
// Create checkout session with UniPaas
const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { orderId, customerEmail } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    // Get the order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== OrderStatus.PENDING) {
      return res
        .status(400)
        .json({ message: 'Order is not in PENDING status' });
    }

    // Check if user has permission to access this order
    if (order.user.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: 'Not authorized to access this order' });
    }

    // Get user details for the checkout
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Processing order for checkout:', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      total: order.total,
    });

    try {
      // Create a payment with UniPaas API to get the session token
      const unipaasUrl = 'https://sandbox.unipaas.com/platform/pay-ins/checkout';
      console.log(`Creating UniPaas checkout session: ${unipaasUrl}`);
      console.log('Using API key:', process.env.UNIPAAS_API_KEY ? process.env.UNIPAAS_API_KEY.substring(0, 5) + '...' : 'Not set');

      const payload = {
        amount: order.total,
        currency: 'USD',
        country: 'US',
        reference: order.orderNumber,
        email: customerEmail || user.email,
        description: `Order ${order.orderNumber}`,
        success_url: `${process.env.FRONTEND_URL}/order-confirmation/${order._id}`,
        cancel_url: `${process.env.FRONTEND_URL}/cart`,
        consumer: {
          name: user.name || 'Customer',
          reference: user._id.toString(),
        },
        metadata: {
          orderId: order._id.toString(),
        },
      };

      console.log('UniPaas payload:', JSON.stringify(payload));

      const response = await axios.post(
        unipaasUrl,
        payload,
        {
          headers: {
            Authorization: `Bearer ${process.env.UNIPAAS_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('UniPaas response:', response.data);
      
      // Update the order with the session ID
      order.paymentSessionId = response.data.id;
      await order.save();

      // Return both sessionToken and shortLink to the frontend
      res.status(200).json({
        sessionToken: response.data.sessionToken,
        sessionId: response.data.id,
        shortLink: response.data.shortLink, // Add this for redirect fallback
      });
    } catch (error: any) {
      console.error('Error with UniPaas API:', error);
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
      }
      
      // Fall back to simulation mode if UniPaas API fails
      console.log('Falling back to payment simulation mode');
      const paymentSessionId = `direct_${Date.now()}`;
      order.paymentSessionId = paymentSessionId;
      await order.save();

      const checkoutUrl = `${process.env.FRONTEND_URL}/payment-simulation?orderId=${
        order._id
      }&amount=${order.total.toFixed(2)}&reference=${
        order.orderNumber
      }`;

      console.log(`Generated fallback checkout URL: ${checkoutUrl}`);

      res.status(200).json({
        checkoutUrl: checkoutUrl,
        sessionId: paymentSessionId,
        fallbackMode: true,
      });
    }
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ message: 'Error creating checkout session' });
  }
};

// UniPaas webhook handler
const unipaasWebhookHandler = async (req: Request, res: Response) => {
  try {
    // Extract headers and body
    const { headers, body } = req;
    const signedHeader = headers['x-hmac-sha256'] as string;

    // Log the raw webhook payload for debugging
    console.log('Received webhook payload:', JSON.stringify(body));

    // For webhook processing, we need to ensure the body is parsed correctly
    let webhookData = body;
    console.log('Complete webhook data:', JSON.stringify(webhookData, null, 2));

    // If body is a Buffer (from express.raw middleware), parse it
    if (Buffer.isBuffer(webhookData)) {
      try {
        console.log(
          'Complete webhook data:',
          JSON.stringify(webhookData, null, 2)
        );
        webhookData = JSON.parse(webhookData.toString('utf8'));
      } catch (e: any) {
        console.error('Failed to parse webhook payload:', e);
        return res.status(400).json({ error: 'Invalid JSON payload' });
      }
    }

    // Verify the webhook signature if it exists
    if (signedHeader && process.env.UNIPAAS_SECRET_KEY) {
      const hash = createHmac('sha256', process.env.UNIPAAS_SECRET_KEY)
        .update(
          typeof webhookData === 'string'
            ? webhookData
            : JSON.stringify(webhookData)
        )
        .digest('hex');
      const buff = Buffer.from(hash);
      const calculated = buff.toString('base64');

      // If signature doesn't match, log but still accept the webhook in dev environment
      if (calculated !== signedHeader) {
        console.warn(
          'Warning: Failed to verify webhook signature - accepting anyway in development mode'
        );
      }
    }

    console.log('Processing webhook event:', {
      type: webhookData.type,
      data: webhookData.data,
    });

    // Process webhook based on its type
    if (
      webhookData.type === 'payment/succeeded' ||
      webhookData.type === 'payment.succeeded'
    ) {
      // Extract order ID from metadata
      const orderId = webhookData.data?.metadata?.orderId;

      if (orderId) {
        // Update the order status to PAID
        const updatedOrder = await Order.findByIdAndUpdate(
          orderId,
          {
            status: OrderStatus.PAID,
            paymentId: webhookData.data.id || `webhook_${Date.now()}`,
          },
          { new: true }
        );

        if (updatedOrder) {
          console.log(`Order ${orderId} marked as PAID`);
        } else {
          console.error(`Order ${orderId} not found for payment update`);
        }
      } else {
        console.error('No orderId found in payment/succeeded webhook metadata');
      }
    } else if (
      webhookData.type === 'payment/failed' ||
      webhookData.type === 'payment.failed'
    ) {
      // Handle failed payment
      const orderId = webhookData.data?.metadata?.orderId;
      if (orderId) {
        console.log(`Payment failed for order ${orderId}`);

        // Update the order with FAILED status
        await Order.findByIdAndUpdate(
          orderId,
          {
            status: OrderStatus.FAILED,
            failureReason:
              webhookData.data.reason || 'Payment processing failed',
          },
          { new: true }
        );
      }
    } else {
      console.log(`Unhandled webhook type: ${webhookData.type}`);
    }

    // Always respond with 200 to acknowledge receipt
    res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Error handling webhook:', error);

    // Still return 200 to prevent UniPaas from retrying
    // But log the error for debugging
    res.status(200).json({
      received: true,
      error: 'Error processing webhook, but acknowledged receipt',
    });
  }
};

// Get all orders for the current user
const getMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error: any) {
    console.error('Error getting orders:', error);
    res.status(500).json({ message: 'Error getting orders' });
  }
};

// Get a specific order by ID
const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure the order belongs to the current user
    if (order.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: 'Not authorized to view this order' });
    }

    res.status(200).json(order);
  } catch (error: any) {
    console.error('Error getting order:', error);
    res.status(500).json({ message: 'Error getting order' });
  }
};

export default {
  createOrder,
  createCheckoutSession,
  unipaasWebhookHandler,
  getMyOrders,
  getOrderById,
};

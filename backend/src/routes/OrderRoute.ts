import express, { RequestHandler } from 'express';
import { jwtCheck, jwtParse } from '../middleware/auth';
import OrderController from '../conrollers/OrderController';
import {
  testUniPaasConnection,
  unipaasWebhookHandler,
  simulatePaymentSuccess,
  simulatePaymentFailure,
} from '../conrollers/UniPaasTestController';


const router = express.Router();

// Special test route for UniPaas API testing
router.get('/test-unipaas', testUniPaasConnection as RequestHandler);

// Skip auth middleware for webhook route, test route, and simulate payment
router.use((req, res, next) => {
  if (
    req.path === '/checkout/webhook' ||
    req.path === '/test-unipaas' ||
    req.path.startsWith('/simulate-payment/') ||
    req.path.startsWith('/simulate-payment-failure/')
  ) {
    return next();
  }
  jwtCheck(req, res, next);
});

router.use((req, res, next) => {
  if (
    req.path === '/checkout/webhook' ||
    req.path === '/test-unipaas' ||
    req.path.startsWith('/simulate-payment/') ||
    req.path.startsWith('/simulate-payment-failure/')
  ) {
    return next();
  }
  jwtParse(req, res, next);
});

// Regular routes
router.get('/', OrderController.getMyOrders as RequestHandler);
router.post('/', OrderController.createOrder as RequestHandler);
router.get('/:id', OrderController.getOrderById as RequestHandler);

// Updated checkout route using the simplified UNIPaaS integration
router.post(
  '/checkout/create-checkout-session',
  OrderController.createCheckoutSession as RequestHandler
);

router.post(
  '/update-status',
  OrderController.updateOrderStatus as RequestHandler
);

// Simulate payment endpoints (for testing)
router.post(
  '/simulate-payment/:orderId',
  simulatePaymentSuccess as RequestHandler
);

router.post(
  '/simulate-payment-failure/:orderId',
  simulatePaymentFailure as RequestHandler
);

// Webhook handler for UNIPaaS notifications
router.post('/checkout/webhook', unipaasWebhookHandler as RequestHandler);

export default router;
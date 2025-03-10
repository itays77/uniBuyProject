import mongoose from 'mongoose';

export enum OrderStatus {
  PENDING = 'PENDING', // Initial status when order is created
  PAID = 'PAID', // Order has been paid via UniPaas
  FAILED = 'FAILED', // Payment failed
}

const orderItemSchema = new mongoose.Schema({
  itemNumber: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  kitType: {
    type: String,
    required: true,
  },
  season: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    // Fields for UniPaas integration
    paymentId: {
      type: String,
    },
    paymentSessionId: {
      type: String,
    },
    failureReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    try {
      const currentYear = new Date().getFullYear();

      // Create a random unique order number
      const randomPart = Math.floor(10000 + Math.random() * 90000);
      this.orderNumber = `ORD-${currentYear}-${randomPart}`;
    } catch (error) {
      console.error('Error generating order number:', error);
      return next(new Error('Failed to generate order number'));
    }
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;

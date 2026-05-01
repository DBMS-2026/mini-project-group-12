const Razorpay = require('razorpay');
const crypto = require('crypto');
const { Order } = require('../models');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET',
});

// @desc    Create new order and Razorpay order
// @route   POST /api/orders/create
const createOrder = async (req, res) => {
  try {
    const { restaurantId, items, totalAmount, paymentMethod, deliveryAddress } = req.body;
    
    // Create order in our database
    const newOrder = await Order.create({
      userId: req.user.id,
      restaurantId,
      totalAmount,
      items,
      status: paymentMethod === 'cod' ? 'processing' : 'pending',
      paymentMethod: paymentMethod || 'razorpay',
      deliveryAddress
    });

    // If COD, skip Razorpay
    if (paymentMethod === 'cod') {
      return sendSuccess(res, { order: newOrder }, 'Order created successfully');
    }

    // Create Razorpay order
    let razorpayOrderId = `mock_order_${newOrder.id}`;
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== 'rzp_test_YOUR_KEY_ID') {
      const options = {
        amount: parseInt(totalAmount * 100), // paise
        currency: 'INR',
        receipt: `receipt_order_${newOrder.id}`,
      };
      const razorpayOrder = await razorpay.orders.create(options);
      razorpayOrderId = razorpayOrder.id;
    }

    // Update DB with razorpay order ID
    await newOrder.update({ razorpayOrderId });

    sendSuccess(res, { 
      order: newOrder,
      razorpayOrderId,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID'
    }, 'Order created');
  } catch (error) {
    sendError(res, error.message || 'Failed to create order');
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/orders/verify
const verifyPayment = async (req, res) => {
  try {
    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    // Mock verification if no real keys
    if (!process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET === 'YOUR_KEY_SECRET') {
      const order = await Order.findByPk(orderId);
      if (order) {
        await order.update({ status: 'processing', razorpayPaymentId: razorpayPaymentId || 'mock_payment' });
        return sendSuccess(res, { order }, 'Payment verified successfully');
      }
      return sendError(res, 'Order not found', 404);
    }

    const sign = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpaySignature === expectedSign) {
      const order = await Order.findByPk(orderId);
      if (order) {
        await order.update({
          status: 'processing',
          razorpayPaymentId
        });
        sendSuccess(res, { order }, 'Payment verified successfully');
      } else {
        sendError(res, 'Order not found', 404);
      }
    } else {
      sendError(res, 'Invalid signature', 400);
    }
  } catch (error) {
    sendError(res, error.message || 'Payment verification failed');
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
const getOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: ['restaurant', 'user']
    });
    if (!order) return sendError(res, 'Order not found', 404);
    
    // Ensure the order belongs to the user
    if (order.userId !== req.user.id) {
      return sendError(res, 'Not authorized', 403);
    }

    sendSuccess(res, { order }, 'Order fetched');
  } catch (error) {
    sendError(res, error.message);
  }
}

// @desc    Get active order
// @route   GET /api/orders/active
const getActiveOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { userId: req.user.id, status: 'processing' },
      order: [['createdAt', 'DESC']],
      include: ['restaurant']
    });
    sendSuccess(res, { order }, 'Active order fetched');
  } catch (error) {
    sendError(res, error.message);
  }
}

// @desc    Get all orders for the logged-in user
// @route   GET /api/orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      include: ['restaurant']
    });
    sendSuccess(res, { orders }, 'User orders fetched');
  } catch (error) {
    sendError(res, error.message);
  }
}

// @desc    Update delivery address for an active order
// @route   PUT /api/orders/:id/address
const updateOrderAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const order = await Order.findByPk(req.params.id);
    
    if (!order) return sendError(res, 'Order not found', 404);
    if (order.userId !== req.user.id) return sendError(res, 'Not authorized', 403);
    
    if (order.status !== 'processing' && order.status !== 'pending') {
      return sendError(res, 'Cannot change address for this order status', 400);
    }

    order.deliveryAddress = address;
    await order.save();

    sendSuccess(res, { order }, 'Delivery address updated successfully');
  } catch (error) {
    sendError(res, error.message);
  }
};

// @desc    Cancel an active order
// @route   PUT /api/orders/:id/cancel
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    
    if (!order) return sendError(res, 'Order not found', 404);
    if (order.userId !== req.user.id) return sendError(res, 'Not authorized', 403);
    
    if (order.status !== 'processing' && order.status !== 'pending') {
      return sendError(res, 'Cannot cancel order at this stage', 400);
    }

    order.status = 'cancelled';
    await order.save();

    sendSuccess(res, { order }, 'Order cancelled successfully');
  } catch (error) {
    sendError(res, error.message);
  }
};

module.exports = { createOrder, verifyPayment, getOrder, getActiveOrder, getUserOrders, updateOrderAddress, cancelOrder };

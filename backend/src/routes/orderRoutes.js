const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getOrder, getActiveOrder, getUserOrders, updateOrderAddress, cancelOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/', protect, getUserOrders);
router.get('/active', protect, getActiveOrder);
router.get('/:id', protect, getOrder);
router.put('/:id/address', protect, updateOrderAddress);
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;

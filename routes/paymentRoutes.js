const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/create-order', protect, paymentController.createOrder);
router.post('/verify', protect, paymentController.verifyPayment);
router.get('/status/:orderId', protect, paymentController.getPaymentStatus);

// New routes for transactions
router.get('/transactions', protect, paymentController.getTransactions);
router.get('/transactions/export', protect, paymentController.exportTransactions);
router.get('/transactions/:id/receipt', protect, paymentController.getReceipt);

module.exports = router;
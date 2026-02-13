const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/auth'); // Assuming you have an auth middleware

// @route   POST /api/orders
// @desc    Place a new order
// @access  Private
router.post('/', protect, orderController.placeOrder);

// @route   GET /api/orders/transactions
// @desc    Get all transactions for the authenticated user with filtering and sorting
// @access  Private
router.get('/transactions', protect, orderController.getTransactions);

// @route   GET /api/orders/:id
// @desc    Get a single order by ID
// @access  Private
router.get('/:id', protect, orderController.getOrderById);

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel an order
// @access  Private
router.put('/:id/cancel', protect, orderController.cancelOrder);

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private (for admin/internal use)
router.put('/:id/status', protect, orderController.updateOrderStatus);

// @route   GET /api/orders/:id/receipt
// @desc    Download PDF receipt for a single order
// @access  Private
router.get('/:id/receipt', protect, orderController.downloadReceipt);

// @route   GET /api/orders/transactions/export?format=csv/pdf
// @desc    Export all transactions for the authenticated user as CSV or PDF
// @access  Private
router.get('/transactions/export', protect, orderController.exportTransactions);

module.exports = router;

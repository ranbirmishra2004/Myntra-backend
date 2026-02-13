const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

// @route   POST /api/notifications/register-token
// @desc    Register a push notification token for a user
// @access  Private
router.post('/register-token', protect, notificationController.registerToken);

// @route   POST /api/notifications/offer
// @desc    Send a promotional offer notification
// @access  Private (for admin/internal use)
router.post('/offer', protect, notificationController.sendOfferNotification);

// @route   POST /api/notifications/cart-abandonment
// @desc    Trigger cart abandonment notifications
// @access  Private (for admin/internal use)
router.post('/cart-abandonment', protect, notificationController.sendCartAbandonmentNotifications);

module.exports = router;

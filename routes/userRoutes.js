const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/me', protect, userController.getMe);
router.put('/update-profile', protect, userController.updateProfile);
router.put('/change-password', protect, userController.changePassword);
router.get('/orders', protect, userController.getOrders);

module.exports = router;

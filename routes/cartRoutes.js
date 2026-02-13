const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/auth'); // Assuming you have an auth middleware

// @route   GET /api/cart
// @desc    Get user's cart contents (active and saved for later)
// @access  Private
router.get('/', protect, cartController.getCart);

// @route   POST /api/cart
// @desc    Add item to cart or increment quantity (default to active cart)
// @access  Private
router.post('/', protect, cartController.addToCart);

// @route   PUT /api/cart/:itemId
// @desc    Update item quantity in cart
// @access  Private
router.put('/:itemId', protect, cartController.updateCartItemQuantity);

// @route   DELETE /api/cart/:itemId
// @desc    Remove item from cart (active or saved)
// @access  Private
router.delete('/:itemId', protect, cartController.removeFromCart);

// @route   PUT /api/cart/save-for-later/:itemId
// @desc    Move item from active cart to "saved for later"
// @access  Private
router.put('/save-for-later/:itemId', protect, cartController.moveToSavedForLater);

// @route   PUT /api/cart/move-to-cart/:itemId
// @desc    Move item from "saved for later" back to active cart
// @access  Private
router.put('/move-to-cart/:itemId', protect, cartController.moveToCart);

module.exports = router;

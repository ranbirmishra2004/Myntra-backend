const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middleware/auth'); // Assuming you have an auth middleware

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', productController.getAllProducts);

// @route   GET /api/products/search
// @desc    Search products by keyword
// @access  Public
router.get('/search', productController.searchProducts);

// @route   GET /api/products/filter
// @desc    Filter products by various criteria
// @access  Public
router.get('/filter', productController.filterProducts);

// @route   GET /api/products/trending
// @desc    Get trending products
// @access  Public
router.get('/trending', productController.getTrendingProducts);

// @route   GET /api/products/new-arrivals
// @desc    Get new arrival products
// @access  Public
router.get('/new-arrivals', productController.getNewArrivals);

// @route   POST /api/products/viewed/:id
// @desc    Log a product view for a user
// @access  Private
router.post('/viewed/:id', protect, productController.logProductView);

// @route   GET /api/products/:id/recommendations
// @desc    Get recommended products based on the viewed product and user behavior
// @access  Private (or Public, depending on if recommendations are user-specific)
router.get('/:id/recommendations', productController.getRecommendedProducts); // Using public for now, can be protect if user-specific needed

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', productController.getProductById);

module.exports = router;

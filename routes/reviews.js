const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Add review to product
router.post('/:productId/reviews', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed this product
    const existingReview = product.reviews.find(review =>
      review.user.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = {
      user: req.user.id,
      rating,
      comment,
    };

    product.reviews.push(review);

    // Calculate average rating
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.averageRating = totalRating / product.reviews.length;
    product.totalReviews = product.reviews.length;

    await product.save();
    await product.populate('reviews.user', 'name');

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get reviews for a product
router.get('/:productId/reviews', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId)
      .populate('reviews.user', 'name')
      .select('reviews averageRating totalReviews');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      reviews: product.reviews,
      averageRating: product.averageRating,
      totalReviews: product.totalReviews
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update review
router.put('/:productId/reviews/:reviewId', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = product.reviews.id(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    review.rating = rating;
    review.comment = comment;

    // Recalculate average rating
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.averageRating = totalRating / product.reviews.length;

    await product.save();
    await product.populate('reviews.user', 'name');

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete review
router.delete('/:productId/reviews/:reviewId', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = product.reviews.id(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    product.reviews.pull(req.params.reviewId);

    // Recalculate average rating
    if (product.reviews.length > 0) {
      const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
      product.averageRating = totalRating / product.reviews.length;
    } else {
      product.averageRating = 0;
    }
    product.totalReviews = product.reviews.length;

    await product.save();

    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
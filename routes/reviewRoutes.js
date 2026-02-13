const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.post('/add', protect, reviewController.addReview);
router.get('/:productId', reviewController.getReviews);
router.delete('/delete/:reviewId', protect, reviewController.deleteReview);

module.exports = router;

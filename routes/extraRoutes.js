const express = require('express');
const router = express.Router();
const extraController = require('../controllers/extraController');

router.get('/banners', extraController.getBanners);
router.get('/offers', extraController.getOffers);
router.get('/recommendations', extraController.getRecommendations);
router.get('/similar-products/:productId', extraController.getSimilarProducts);

module.exports = router;

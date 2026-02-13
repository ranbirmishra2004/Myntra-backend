const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products');
        if (!wishlist) {
            return res.status(200).json([]);
        }
        res.status(200).json(wishlist.products);
    } catch (error) {
        console.error('Error getting wishlist:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add a product to the wishlist
// @route   POST /api/wishlist
// @access  Private
exports.addToWishlist = async (req, res) => {
    const { productId } = req.body;
    try {
        let wishlist = await Wishlist.findOne({ user: req.user.id });
        if (!wishlist) {
            wishlist = new Wishlist({ user: req.user.id, products: [] });
        }

        if (wishlist.products.includes(productId)) {
            return res.status(400).json({ message: 'Product already in wishlist' });
        }

        wishlist.products.push(productId);
        await wishlist.save();
        res.status(201).json(wishlist);
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Remove a product from the wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
exports.removeFromWishlist = async (req, res) => {
    const { productId } = req.params;
    try {
        const wishlist = await Wishlist.findOne({ user: req.user.id });
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
        await wishlist.save();
        res.status(200).json(wishlist);
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

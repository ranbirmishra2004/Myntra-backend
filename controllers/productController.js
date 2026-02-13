const Product = require('../models/Product');
const Category = require('../models/Category'); // Assuming Category model exists
const BrowsingHistory = require('../models/BrowsingHistory');
const Wishlist = require('../models/Wishlist'); // Assuming Wishlist model exists

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching all products:', error);
    res.status(500).json({ message: 'Server error while fetching products.' });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Server error while fetching product.' });
  }
};

// @desc    Log a product view for a user
// @route   POST /api/products/viewed/:id
// @access  Private
exports.logProductView = async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.id;

  try {
    // Remove old view of this product by this user
    await BrowsingHistory.deleteOne({ user: userId, product: productId });

    // Add new view
    const newView = new BrowsingHistory({
      user: userId,
      product: productId,
    });
    await newView.save();

    res.status(200).json({ message: 'Product view logged successfully.' });
  } catch (error) {
    console.error('Error logging product view:', error);
    res.status(500).json({ message: 'Server error while logging product view.' });
  }
};

// @desc    Get recommended products based on viewed product, user's browsing history and wishlist
// @route   GET /api/products/:id/recommendations
// @access  Private (or Public, depending on whether recommendations are user-specific)
exports.getRecommendedProducts = async (req, res) => {
  const viewedProductId = req.params.id;
  const userId = req.user ? req.user.id : null; // userId might be null if not logged in

  try {
    const viewedProduct = await Product.findById(viewedProductId);
    if (!viewedProduct) {
      return res.status(404).json({ message: 'Viewed product not found.' });
    }

    let recommendations = [];
    let baseQuery = { _id: { $ne: viewedProductId } }; // Exclude the currently viewed product

    // 1. Category-Based Recommendations
    if (viewedProduct.category) {
      const categoryRecs = await Product.find({
        ...baseQuery,
        category: viewedProduct.category,
      }).limit(5);
      recommendations.push(...categoryRecs);
    }

    // 2. User-Specific Browsing History (if logged in)
    if (userId) {
      const recentViews = await BrowsingHistory.find({ user: userId })
        .sort({ timestamp: -1 })
        .limit(10)
        .populate('product');

      const browsingRecs = [];
      const viewedCategories = new Set();
      if (viewedProduct.category) viewedCategories.add(viewedProduct.category.toString());

      for (const historyItem of recentViews) {
        if (historyItem.product && historyItem.product.category) {
          viewedCategories.add(historyItem.product.category.toString());
        }
      }

      // Find products similar to recently viewed categories, but not already recommended
      const categoryFromHistoryRecs = await Product.find({
        ...baseQuery,
        category: { $in: Array.from(viewedCategories) },
        _id: { $nin: recommendations.map(p => p._id) },
      }).limit(5);
      recommendations.push(...categoryFromHistoryRecs);
    }

    // 3. Wishlist-Based Recommendations (if logged in)
    if (userId) {
      const userWishlist = await Wishlist.findOne({ user: userId }).populate('items');
      if (userWishlist && userWishlist.items.length > 0) {
        const wishlistCategories = new Set(
          userWishlist.items.map(item => item.product.category.toString())
        );
        const wishlistBrands = new Set(
          userWishlist.items.map(item => item.product.brand.toString())
        );

        const wishlistRecs = await Product.find({
          ...baseQuery,
          $or: [
            { category: { $in: Array.from(wishlistCategories) } },
            { brand: { $in: Array.from(wishlistBrands) } },
          ],
          _id: { $nin: recommendations.map(p => p._id) }, // Avoid duplicates
        }).limit(5);
        recommendations.push(...wishlistRecs);
      }
    }

    // Remove duplicates and limit to a reasonable number
    const uniqueRecommendations = [];
    const seenIds = new Set();
    for (const rec of recommendations) {
      if (!seenIds.has(rec._id.toString()) && rec._id.toString() !== viewedProductId) {
        uniqueRecommendations.push(rec);
        seenIds.add(rec._id.toString());
      }
    }

    // Fallback: If not enough recommendations, get random products from the same category or overall
    if (uniqueRecommendations.length < 5) {
      const moreRecs = await Product.find({
        ...baseQuery,
        _id: { $nin: uniqueRecommendations.map(p => p._id).concat(viewedProductId) },
      }).limit(5 - uniqueRecommendations.length);
      uniqueRecommendations.push(...moreRecs);
    }


    res.status(200).json(uniqueRecommendations.slice(0, 10)); // Limit to 10 for carousel
  } catch (error) {
    console.error('Error fetching recommended products:', error);
    res.status(500).json({ message: 'Server error while fetching recommendations.' });
  }
};


// Placeholder implementations for existing functions
exports.searchProducts = async (req, res) => {
    const { q } = req.query;
    try {
        const products = await Product.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { brand: { $regex: q, $options: 'i' } },
            ],
        });
        res.status(200).json(products);
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ message: 'Server error during product search.' });
    }
};

exports.filterProducts = async (req, res) => {
    const { category, brand, minPrice, maxPrice } = req.query;
    let query = {};

    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (minPrice) query.price = { ...query.price, $gte: parseFloat(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: parseFloat(maxPrice) };

    try {
        const products = await Product.find(query);
        res.status(200).json(products);
    } catch (error) {
        console.error('Error filtering products:', error);
        res.status(500).json({ message: 'Server error during product filtering.' });
    }
};

exports.getTrendingProducts = async (req, res) => {
    // This is a placeholder; real trending logic would involve analytics
    try {
        const products = await Product.find({}).sort({ createdAt: -1 }).limit(10); // Example: newest 10 products
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching trending products:', error);
        res.status(500).json({ message: 'Server error while fetching trending products.' });
    }
};

exports.getNewArrivals = async (req, res) => {
    // This is a placeholder; real new arrivals logic would involve product creation date
    try {
        const products = await Product.find({}).sort({ createdAt: -1 }).limit(10); // Example: newest 10 products
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching new arrivals:', error);
        res.status(500).json({ message: 'Server error while fetching new arrivals.' });
    }
};
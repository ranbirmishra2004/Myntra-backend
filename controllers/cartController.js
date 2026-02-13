const Cart = require('../models/Cart');
const Product = require('../models/Product'); // Assuming Product model exists

// Helper function to calculate cart total for active items only
const calculateCartTotal = (cart) => {
  let total = 0;
  if (cart && cart.items) {
    cart.items.forEach(item => {
      if (!item.savedForLater) {
        total += item.quantity * item.product.price;
      }
    });
  }
  return total;
};

// @desc    Get user's cart contents, separated into active and saved for later
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product', 'name price image');

    if (!cart) {
      return res.status(200).json({ activeCartItems: [], savedForLaterItems: [], totalAmount: 0 });
    }

    const activeCartItems = cart.items.filter(item => !item.savedForLater);
    const savedForLaterItems = cart.items.filter(item => item.savedForLater);
    const totalAmount = calculateCartTotal(cart);

    res.status(200).json({ activeCartItems, savedForLaterItems, totalAmount });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Server error while fetching cart.' });
  }
};

// @desc    Add item to cart or increment quantity
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res) => {
  const { productId, quantity, size } = req.body;
  const userId = req.user.id;

  try {
    let cart = await Cart.findOne({ user: userId });
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    if (!cart) {
      // Create new cart if none exists for the user
      cart = new Cart({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.size === size
    );

    if (itemIndex > -1) {
      // If item exists, update quantity and ensure it's in the active cart
      cart.items[itemIndex].quantity += quantity;
      cart.items[itemIndex].savedForLater = false; // Move back to active if it was saved
    } else {
      // Add new item to cart
      cart.items.push({ product: productId, quantity, size, savedForLater: false });
    }

    await cart.save();
    await cart.populate('items.product', 'name price image');
    const activeCartItems = cart.items.filter(item => !item.savedForLater);
    const savedForLaterItems = cart.items.filter(item => item.savedForLater);
    const totalAmount = calculateCartTotal(cart);

    res.status(200).json({ activeCartItems, savedForLaterItems, totalAmount });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Server error while adding to cart.' });
  }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/:itemId
// @access  Private
exports.updateCartItemQuantity = async (req, res) => {
  const { quantity } = req.body;
  const { itemId } = req.params; // itemId is the _id of the item in the cart's items array
  const userId = req.user.id;

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      await cart.populate('items.product', 'name price image');
      const activeCartItems = cart.items.filter(item => !item.savedForLater);
      const savedForLaterItems = cart.items.filter(item => item.savedForLater);
      const totalAmount = calculateCartTotal(cart);

      return res.status(200).json({ activeCartItems, savedForLaterItems, totalAmount });
    } else {
      return res.status(404).json({ message: 'Cart item not found.' });
    }
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    res.status(500).json({ message: 'Server error while updating cart item quantity.' });
  }
};


// @desc    Remove item from cart (either active or saved for later)
// @route   DELETE /api/cart/:itemId
// @access  Private
exports.removeFromCart = async (req, res) => {
  const { itemId } = req.params; // itemId is the _id of the item in the cart's items array
  const userId = req.user.id;

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

    if (cart.items.length === initialLength) {
      return res.status(404).json({ message: 'Cart item not found.' });
    }

    await cart.save();
    await cart.populate('items.product', 'name price image');
    const activeCartItems = cart.items.filter(item => !item.savedForLater);
    const savedForLaterItems = cart.items.filter(item => item.savedForLater);
    const totalAmount = calculateCartTotal(cart);

    res.status(200).json({ activeCartItems, savedForLaterItems, totalAmount });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Server error while removing from cart.' });
  }
};

// @desc    Move item to saved for later section
// @route   PUT /api/cart/save-for-later/:itemId
// @access  Private
exports.moveToSavedForLater = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user.id;

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);

    if (itemIndex > -1) {
      cart.items[itemIndex].savedForLater = true;
      await cart.save();
      await cart.populate('items.product', 'name price image');
      const activeCartItems = cart.items.filter(item => !item.savedForLater);
      const savedForLaterItems = cart.items.filter(item => item.savedForLater);
      const totalAmount = calculateCartTotal(cart);

      return res.status(200).json({ activeCartItems, savedForLaterItems, totalAmount });
    } else {
      return res.status(404).json({ message: 'Cart item not found.' });
    }
  } catch (error) {
    console.error('Error moving item to saved for later:', error);
    res.status(500).json({ message: 'Server error while moving item to saved for later.' });
  }
};

// @desc    Move item from saved for later back to active cart
// @route   PUT /api/cart/move-to-cart/:itemId
// @access  Private
exports.moveToCart = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user.id;

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);

    if (itemIndex > -1) {
      cart.items[itemIndex].savedForLater = false;
      await cart.save();
      await cart.populate('items.product', 'name price image');
      const activeCartItems = cart.items.filter(item => !item.savedForLater);
      const savedForLaterItems = cart.items.filter(item => item.savedForLater);
      const totalAmount = calculateCartTotal(cart);

      return res.status(200).json({ activeCartItems, savedForLaterItems, totalAmount });
    } else {
      return res.status(404).json({ message: 'Cart item not found.' });
    }
  } catch (error) {
    console.error('Error moving item to cart:', error);
    res.status(500).json({ message: 'Server error while moving item to cart.' });
  }
};
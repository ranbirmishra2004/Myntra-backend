const NotificationToken = require('../models/NotificationToken');
const Cart = require('../models/Cart');
const { sendPushNotification } = require('../utils/notificationSender');

// @desc    Send a promotional offer notification to a specific user
// @route   POST /api/notifications/offer
// @access  Private (for admin/internal use)
exports.sendOfferNotification = async (req, res) => {
    const { userId, title, body, data } = req.body;

    if (!userId || !title || !body) {
        return res.status(400).json({ message: 'userId, title, and body are required.' });
    }

    try {
        await sendPushNotification(userId, title, body, data);
        res.status(200).json({ message: 'Offer notification sent successfully.' });
    } catch (error) {
        console.error('Error sending offer notification:', error);
        res.status(500).json({ message: 'Server error while sending offer notification.' });
    }
};

// @desc    Trigger cart abandonment notifications (for demonstration)
// @route   POST /api/notifications/cart-abandonment
// @access  Private (for admin/internal use)
exports.sendCartAbandonmentNotifications = async (req, res) => {
    try {
        // Find carts updated between 24 and 25 hours ago, with items in them.
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

        const abandonedCarts = await Cart.find({
            updatedAt: { $gte: twoDaysAgo, $lt: oneDayAgo },
            'items.0': { $exists: true } // Ensure cart is not empty
        }).populate('user', 'name');

        if (abandonedCarts.length === 0) {
            return res.status(200).json({ message: 'No abandoned carts to notify.' });
        }
        
        let notificationsSent = 0;
        for (const cart of abandonedCarts) {
            const title = `Don't miss out, ${cart.user.name}!`;
            const body = 'You have items in your cart. Complete your purchase before they sell out!';
            await sendPushNotification(cart.user._id, title, body, { screen: 'Cart' });
            notificationsSent++;
        }

        res.status(200).json({ message: `${notificationsSent} cart abandonment notifications sent.` });
    } catch (error) {
        console.error('Error sending cart abandonment notifications:', error);
        res.status(500).json({ message: 'Server error while sending notifications.' });
    }
};

// @desc    Register a push notification token for a user
// @route   POST /api/notifications/register-token
// @access  Private
exports.registerToken = async (req, res) => {
  const { expoPushToken } = req.body;
  const userId = req.user.id;

  if (!expoPushToken) {
    return res.status(400).json({ message: 'Push token is required.' });
  }

  try {
    // Use findOneAndUpdate to either create a new token entry or update an existing one for the user.
    // This prevents duplicate tokens for the same user.
    const token = await NotificationToken.findOneAndUpdate(
      { user: userId },
      { token: expoPushToken },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ message: 'Token registered successfully.', token });
  } catch (error) {
    console.error('Error registering push token:', error);
    // Handle potential duplicate key error if a token is registered to another user
    if (error.code === 11000) {
        return res.status(409).json({ message: 'This device is already registered with another account.' });
    }
    res.status(500).json({ message: 'Server error while registering push token.' });
  }
};

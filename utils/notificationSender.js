const { Expo } = require('expo-server-sdk');
const NotificationToken = require('../models/NotificationToken');

// Create a new Expo SDK client
const expo = new Expo();

// @desc    Send a push notification to a specific user
// @param   userId - The ID of the user to send the notification to
// @param   title - The title of the notification
// @param   body - The body of the notification
// @param   data - Optional data to send with the notification
const sendPushNotification = async (userId, title, body, data = {}) => {
  try {
    const notificationToken = await NotificationToken.findOne({ user: userId });
    if (!notificationToken) {
      console.log(`No push token found for user ${userId}`);
      return;
    }

    const token = notificationToken.token;
    if (!Expo.isExpoPushToken(token)) {
      console.error(`Push token ${token} is not a valid Expo push token`);
      return;
    }

    const message = {
      to: token,
      sound: 'default',
      title,
      body,
      data,
    };

    await expo.sendPushNotificationsAsync([message]);
    console.log(`Push notification sent to user ${userId}`);
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
};

module.exports = { sendPushNotification };

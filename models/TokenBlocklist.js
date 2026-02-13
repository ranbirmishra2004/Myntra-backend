const mongoose = require('mongoose');

const tokenBlocklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    expires: '1h', // Automatically remove the token after 1 hour (same as token expiry)
    default: Date.now,
  },
});

module.exports = mongoose.model('TokenBlocklist', tokenBlocklistSchema);

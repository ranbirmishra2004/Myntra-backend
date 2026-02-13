const mongoose = require('mongoose');

const browsingHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Optional: Add index for faster queries
browsingHistorySchema.index({ user: 1, timestamp: -1 });
browsingHistorySchema.index({ product: 1, timestamp: -1 });

module.exports = mongoose.model('BrowsingHistory', browsingHistorySchema);

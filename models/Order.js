const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  size: { type: String },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  paymentMethod: { type: String, default: 'Cash on Delivery' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
  trackingNumber: { type: String },
  estimatedDelivery: { type: Date },
  orderNotes: { type: String },
  couponCode: { type: String },
  discountAmount: { type: Number, default: 0 },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for transaction type
orderSchema.virtual('type').get(function() {
  if (this.status === 'Cancelled' || this.paymentStatus === 'Refunded') {
    return 'Refund';
  }
  if (this.paymentMethod === 'Cash on Delivery') {
    return 'COD';
  }
  return 'Online';
});

module.exports = mongoose.model('Order', orderSchema);
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }],
  sizes: [{ type: String }],
  category: { type: String, required: true },
  brand: { type: String },
  variants: [{
    color: String,
    images: [{ type: String }],
    sizes: [{ size: String, stock: { type: Number, default: 10 } }]
  }],
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  stock: { type: Number, default: 100 },
  discount: { type: Number, default: 0 },
  originalPrice: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
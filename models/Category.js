const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  // Add other fields as needed, e.g., description, imageUrl, parentCategory, etc.
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
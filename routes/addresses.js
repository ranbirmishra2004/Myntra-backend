const express = require('express');
const router = express.Router();
const Address = require('../models/Address');
const auth = require('../middleware/auth');

// Get all addresses for user
router.get('/', auth, async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new address
router.post('/', auth, async (req, res) => {
  try {
    const { name, phone, addressLine1, addressLine2, city, state, pincode, type, isDefault } = req.body;

    // If setting as default, unset other default addresses
    if (isDefault) {
      await Address.updateMany({ user: req.user.id }, { isDefault: false });
    }

    const address = new Address({
      user: req.user.id,
      name,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      type,
      isDefault,
    });

    const savedAddress = await address.save();
    res.status(201).json(savedAddress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update address
router.put('/:id', auth, async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    if (address.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { name, phone, addressLine1, addressLine2, city, state, pincode, type, isDefault } = req.body;

    // If setting as default, unset other default addresses
    if (isDefault) {
      await Address.updateMany({ user: req.user.id, _id: { $ne: req.params.id } }, { isDefault: false });
    }

    address.name = name;
    address.phone = phone;
    address.addressLine1 = addressLine1;
    address.addressLine2 = addressLine2;
    address.city = city;
    address.state = state;
    address.pincode = pincode;
    address.type = type;
    address.isDefault = isDefault;

    const updatedAddress = await address.save();
    res.json(updatedAddress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete address
router.delete('/:id', auth, async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    if (address.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await address.remove();
    res.json({ message: 'Address deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Set default address
router.patch('/:id/default', auth, async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    if (address.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Unset all default addresses for this user
    await Address.updateMany({ user: req.user.id }, { isDefault: false });

    // Set this address as default
    address.isDefault = true;
    await address.save();

    res.json(address);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
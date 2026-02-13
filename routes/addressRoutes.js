const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const { protect } = require('../middleware/auth');

router.get('/', protect, addressController.getAddresses);
router.post('/add', protect, addressController.addAddress);
router.put('/update/:addressId', protect, addressController.updateAddress);
router.delete('/delete/:addressId', protect, addressController.deleteAddress);

module.exports = router;

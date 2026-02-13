const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/otp-login', authController.otpLogin);
router.post('/verify-otp', authController.verifyOtp);
router.post('/logout', authController.logout);
router.get('/refresh-token', authController.refreshToken);

module.exports = router;

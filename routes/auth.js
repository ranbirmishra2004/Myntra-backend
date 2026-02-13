const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const TokenBlocklist = require('../models/TokenBlocklist');

router.post('/register', async (req, res) => {
  console.log('POST /register');
  console.log(req.body);
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      console.log('All fields required');
      return res.status(400).json({ message: 'All fields required' });
    }

    console.log('Checking for existing user...');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists');
      return res.status(400).json({ message: 'User already exists' });
    }
    console.log('User does not exist, proceeding with registration.');

    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed.');

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    console.log('Saving user to database...');
    await user.save();
    console.log('User saved.');

    console.log('Signing JWT token...');
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    console.log('Token signed.');

    res.status(201).json({ token, user });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  console.log('POST /login');
  console.log(req.body);
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      console.log('All fields required');
      return res.status(400).json({ message: 'All fields required' });
    }

    console.log('Finding user by email...');
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Invalid credentials');
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    console.log('User found.');

    console.log('Comparing passwords...');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Passwords do not match');
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    console.log('Passwords match.');

    console.log('Signing JWT token...');
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    console.log('Token signed.');

    res.status(200).json({ token, user });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/logout', async (req, res) => {
  console.log('POST /logout');
  const token = req.header('Authorization').replace('Bearer ', '');

  try {
    const blocklistedToken = new TokenBlocklist({ token });
    await blocklistedToken.save();
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

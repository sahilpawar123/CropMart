// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For creating tokens
const User = require('../models/User'); // Import the User model we created

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
  // 1. Get data from the request body
  const { name, email, password, role } = req.body;

  try {
    // 2. Check if a user with this email already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists with this email.' });
    }

    // 3. Create a new user instance
    user = new User({
      name,
      email,
      password,
      role, // Make sure role is 'farmer' or 'trader'
    });

    // 4. Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 5. Save the user to the database
    await user.save();

    // 6. Create a JWT payload (data to include in the token)
    const payload = {
      user: {
        id: user.id, // User's unique database ID
        role: user.role // User's role
      }
    };

    // 7. Sign the token with a secret key
    // IMPORTANT: Replace 'yourSecretKey' with a secure key from environment variables later!
    jwt.sign(
      payload,
      'yourSecretKey',
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        // 8. Send the token back to the frontend
        res.status(201).json({ token });
      }
    );

  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).send('Server error during signup.');
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  // 1. Get email and password from request body
  const { email, password } = req.body;

  try {
    // 2. Find the user by email
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 3. Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 4. Create JWT payload
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    // 5. Sign and return the token and user data (excluding password)
    jwt.sign(
      payload,
      'yourSecretKey', // Replace later!
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: { // Send user details back to frontend for the auth store
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      }
    );

  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).send('Server error during login.');
  }
});

module.exports = router;
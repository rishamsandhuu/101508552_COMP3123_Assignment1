const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const User = require('./model/user.js');

const app = express();
app.use(cors());
app.use(express.json());

// Sign-up route
app.post(
  '/user/signup',
  [
    body('username')
      .notEmpty().withMessage('Username is required')
      .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('email')
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email address'),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = new User(req.body);
      await user.save();

      res.status(201).json({
        message: 'User registered successfully',
        user_id: user._id
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// Login route
app.post(
  '/user/login',
  [
    body('usernameOrEmail')
      .notEmpty().withMessage('Username or email is required'),
    body('password')
      .notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { usernameOrEmail, password } = req.body;


      const user = await User.findOne({
        $or: [
          { username: new RegExp(`^${usernameOrEmail}$`, 'i') },
          { email: new RegExp(`^${usernameOrEmail}$`, 'i') }
        ]
      });

      if (!user) return res.status(404).json({ error: 'User not found' });

      const isMatched = await user.comparePassword(password);
      if (!isMatched) return res.status(400).json({ error: 'Invalid password' });

      const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({ message: 'Login successful', token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

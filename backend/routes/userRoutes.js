const express = require('express');
const { body } = require('express-validator');
const { signup, login } = require('../controller/userController');
const handleValidation = require('../middleware/handleValidation');

const router = express.Router();

// Sign-up
router.post(
  '/signup',
  [
    body('username').notEmpty().withMessage('Username is required').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  handleValidation,
  signup
);

// Login
router.post(
  '/login',
  [
    body('usernameOrEmail').notEmpty().withMessage('Username or email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  handleValidation,
  login
);

module.exports = router;
// routes/authRoutes.js
const express = require('express');
const {
  register,
  login,
  getMe,
  verifyToken // Add this import
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Make sure these controller functions exist and are exported
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/verify', protect, verifyToken); // Add this new route

module.exports = router;
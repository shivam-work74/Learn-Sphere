// backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();

// Merged: Import getUserProfile from the controller
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');

// Merged: Import the protect middleware
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Merged: Add the new protected route for the user's profile
// The 'protect' middleware will run first to verify the token.
router.get('/profile', protect, getUserProfile);

module.exports = router;
const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    getAllUsers, 
    getCurrentUser 
} = require('../controllers/authController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', authMiddleware, getCurrentUser);
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);

module.exports = router;
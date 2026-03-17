const express = require('express');
const router = express.Router();
const {
    borrowBook,
    getUserBorrowedBooks,
    getPendingRequests,
    approveBorrowRequest,
    rejectBorrowRequest,
    returnBook
} = require('../controllers/borrowController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// User routes
router.post('/', authMiddleware, borrowBook);
router.get('/my-books', authMiddleware, getUserBorrowedBooks);
router.put('/:id/return', authMiddleware, returnBook);

// Admin routes
router.get('/pending', authMiddleware, adminMiddleware, getPendingRequests);
router.put('/:id/approve', authMiddleware, adminMiddleware, approveBorrowRequest);
router.put('/:id/reject', authMiddleware, adminMiddleware, rejectBorrowRequest);

module.exports = router;
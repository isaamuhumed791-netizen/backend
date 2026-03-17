const express = require('express');
const router = express.Router();
const {
    getAllBooks,
    getBookById,
    searchBooks,
    addBook,
    updateBook,
    deleteBook
} = require('../controllers/bookController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllBooks);
router.get('/search', searchBooks);
router.get('/:id', getBookById);

// Protected routes (Admin only)
router.post('/', authMiddleware, adminMiddleware, addBook);
router.put('/:id', authMiddleware, adminMiddleware, updateBook);
router.delete('/:id', authMiddleware, adminMiddleware, deleteBook);

module.exports = router;
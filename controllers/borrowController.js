const Borrow = require('../models/Borrow');
const Book = require('../models/Book');

// Borrow a book
const borrowBook = async (req, res) => {
    try {
        const { bookId, days } = req.body;
        const userId = req.user._id;

        // Check if book exists
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Check if book is available
        if (book.quantity < 1) {
            return res.status(400).json({ message: 'Book is not available' });
        }

        // Calculate due date and total cost
        const borrowDate = new Date();
        const dueDate = new Date(borrowDate);
        dueDate.setDate(dueDate.getDate() + days);
        const totalCost = book.pricePerDay * days;

        // Create borrow record
        const borrow = new Borrow({
            userId,
            bookId,
            borrowDate,
            dueDate,
            days,
            totalCost,
            status: 'pending'
        });

        // Decrease book quantity
        book.quantity -= 1;
        await book.save();
        await borrow.save();

        res.status(201).json({
            message: 'Book borrowed successfully',
            borrow
        });
    } catch (error) {
        console.error('Borrow book error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user's borrowed books
const getUserBorrowedBooks = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const borrowedBooks = await Borrow.find({ userId })
            .populate('bookId', 'title author isbn category pricePerDay')
            .sort({ borrowDate: -1 });

        res.json(borrowedBooks);
    } catch (error) {
        console.error('Get borrowed books error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get pending borrow requests (Admin only)
const getPendingRequests = async (req, res) => {
    try {
        const pendingRequests = await Borrow.find({ status: 'pending' })
            .populate('userId', 'name email')
            .populate('bookId', 'title author isbn')
            .sort({ borrowDate: -1 });

        res.json(pendingRequests);
    } catch (error) {
        console.error('Get pending requests error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Approve borrow request (Admin only)
const approveBorrowRequest = async (req, res) => {
    try {
        const borrow = await Borrow.findById(req.params.id)
            .populate('bookId');

        if (!borrow) {
            return res.status(404).json({ message: 'Borrow request not found' });
        }

        if (borrow.status !== 'pending') {
            return res.status(400).json({ message: 'Request is not pending' });
        }

        borrow.status = 'approved';
        await borrow.save();

        res.json({
            message: 'Borrow request approved',
            borrow
        });
    } catch (error) {
        console.error('Approve borrow error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Reject borrow request (Admin only)
const rejectBorrowRequest = async (req, res) => {
    try {
        const borrow = await Borrow.findById(req.params.id)
            .populate('bookId');

        if (!borrow) {
            return res.status(404).json({ message: 'Borrow request not found' });
        }

        if (borrow.status !== 'pending') {
            return res.status(400).json({ message: 'Request is not pending' });
        }

        // Return book quantity
        if (borrow.bookId) {
            borrow.bookId.quantity += 1;
            await borrow.bookId.save();
        }

        borrow.status = 'rejected';
        await borrow.save();

        res.json({
            message: 'Borrow request rejected',
            borrow
        });
    } catch (error) {
        console.error('Reject borrow error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Return book
const returnBook = async (req, res) => {
    try {
        const borrow = await Borrow.findById(req.params.id)
            .populate('bookId');

        if (!borrow) {
            return res.status(404).json({ message: 'Borrow record not found' });
        }

        if (borrow.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Return book quantity
        if (borrow.bookId) {
            borrow.bookId.quantity += 1;
            await borrow.bookId.save();
        }

        borrow.status = 'returned';
        borrow.returnedDate = new Date();
        await borrow.save();

        res.json({
            message: 'Book returned successfully',
            borrow
        });
    } catch (error) {
        console.error('Return book error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    borrowBook,
    getUserBorrowedBooks,
    getPendingRequests,
    approveBorrowRequest,
    rejectBorrowRequest,
    returnBook
};
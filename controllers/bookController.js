const Book = require('../models/Book');

// Get all books
const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        res.json(books);
    } catch (error) {
        console.error('Get books error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single book
const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (error) {
        console.error('Get book error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Search books
const searchBooks = async (req, res) => {
    try {
        const { query, category } = req.query;
        let searchCriteria = {};

        if (query) {
            searchCriteria.$or = [
                { title: { $regex: query, $options: 'i' } },
                { author: { $regex: query, $options: 'i' } },
                { isbn: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } }
            ];
        }

        if (category) {
            searchCriteria.category = category;
        }

        const books = await Book.find(searchCriteria);
        res.json(books);
    } catch (error) {
        console.error('Search books error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add new book (Admin only)
const addBook = async (req, res) => {
    try {
        const { title, author, isbn, category, quantity, pricePerDay, description } = req.body;

        // Check if book already exists
        let book = await Book.findOne({ isbn });
        if (book) {
            return res.status(400).json({ message: 'Book with this ISBN already exists' });
        }

        // Create new book
        book = new Book({
            title,
            author,
            isbn,
            category,
            quantity: quantity || 1,
            pricePerDay: pricePerDay || 50,
            description
        });

        await book.save();
        res.status(201).json({
            message: 'Book added successfully',
            book
        });
    } catch (error) {
        console.error('Add book error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update book (Admin only)
const updateBook = async (req, res) => {
    try {
        const { quantity, pricePerDay } = req.body;
        const updateData = {};

        if (quantity !== undefined) updateData.quantity = quantity;
        if (pricePerDay !== undefined) updateData.pricePerDay = pricePerDay;

        const book = await Book.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.json({
            message: 'Book updated successfully',
            book
        });
    } catch (error) {
        console.error('Update book error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete book (Admin only)
const deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error('Delete book error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllBooks,
    getBookById,
    searchBooks,
    addBook,
    updateBook,
    deleteBook
};
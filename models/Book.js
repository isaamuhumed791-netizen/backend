const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    isbn: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['fiction', 'non-fiction', 'science', 'technology', 'history', 'biography']
    },
    description: {
        type: String,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
        default: 1
    },
    pricePerDay: {
        type: Number,
        required: true,
        min: 10,
        default: 50
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Book', bookSchema);
const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    borrowDate: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true
    },
    days: {
        type: Number,
        required: true,
        min: 1,
        max: 30
    },
    totalCost: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'returned'],
        default: 'pending'
    },
    returnedDate: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Borrow', borrowSchema);
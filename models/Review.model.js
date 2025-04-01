const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Book'
    },
    reviewedBy: {
        type: String,
        required: true,
        default: 'Guest',
    },
    reviewedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        message: "Rating should be between 1 and 5"
    },
    review: {
        type: String,
        default: ''
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

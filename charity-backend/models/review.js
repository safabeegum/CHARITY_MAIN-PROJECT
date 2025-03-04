const mongoose = require("mongoose");
const reviewSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    review: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,  // Minimum rating should be 1 star
        max: 5   // Maximum rating should be 5 stars
    },
    postedDate: {
        type: Date,
        default: Date.now
    }
});

const reviewModel = mongoose.model("review", reviewSchema);
module.exports = reviewModel;
